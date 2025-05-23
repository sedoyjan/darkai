import Elysia, { t } from "elysia";
import { db } from "../db";
import { isAuthenticated } from "../middlewares/auth";
import { User } from "../../prisma/prisma-client-js";

export const UserController = (app: Elysia) => {
  app
    .group("/user", (app) =>
      app
        .use(isAuthenticated)
        .get(
          "/me",
          async ({ user }) => {
            const userRecord = await db.user.findFirst({
              where: {
                id: user.id,
              },
            });

            const FREE_REQUESTS_LIMIT = process.env.FREE_REQUESTS_LIMIT
              ? parseInt(process.env.FREE_REQUESTS_LIMIT, 10)
              : 10;

            const hasFreeRequests = userRecord
              ? userRecord.requestsCount < FREE_REQUESTS_LIMIT
              : false;

            console.log(
              "🚀 ~ requestsCount",
              userRecord?.requestsCount || 0,
              "/",
              FREE_REQUESTS_LIMIT
            );

            return {
              hasFreeRequests,
            };
          },
          {
            response: t.Object({
              hasFreeRequests: t.Boolean(),
            }),
          }
        )
        .post(
          "/user/update-fcm-token",
          async ({ body, user }) => {
            const { fcmToken } = body;
            const uid = user.id;

            const existingUser = await db.user.findFirst({
              where: {
                id: uid,
              },
            });

            if (!existingUser) {
              console.log(`User with uid ${uid} not found`);
              return {
                success: false,
                message: "User not found",
              };
            }

            if (
              !existingUser.fcmToken.includes(fcmToken) &&
              fcmToken.length > 0
            ) {
              await db.user
                .update({
                  where: {
                    id: existingUser.id,
                  },
                  data: {
                    fcmToken: {
                      push: fcmToken,
                    },
                  },
                })
                .catch((error) => {
                  console.error(
                    "🚀 ~ /user/update-fcm-token ~ db.user.update error:",
                    error
                  );
                  throw new Error("Failed to update FCM token");
                });

              return {
                success: true,
                message: "FCM token updated successfully",
              };
            }

            return {
              success: true,
              message: "FCM token already exists",
            };
          },
          {
            body: t.Object({
              fcmToken: t.String(),
            }),
            response: t.Object({
              success: t.Boolean(),
              message: t.String(),
            }),
          }
        )
        .post(
          "/update-locale",
          async ({ user, body }) => {
            await db.user.update({
              where: {
                id: user.id,
              },
              data: {
                locale: body.locale,
              },
            });
          },
          {
            body: t.Object({
              locale: t.String(),
            }),
            responses: {
              200: t.Null(),
              401: t.Object({ error: t.String() }),
            },
            summary: "Update user locale",
            description:
              "Endpoint to update the locale of the authenticated user",
          }
        )
        .post("/delete-account", async ({ user }) => {
          await db.user
            .delete({
              where: {
                id: user.id,
              },
            })
            .catch((error) => {
              console.error("🚀 delete-account error:", error);
            });
        })
        .post(
          "/check-subscription",
          async (context) => {
            const user = await db.user.findUnique({
              where: {
                id: context.user.id,
              },
            });

            const isActive = (user?.expirationAtMs || 0) > Date.now();

            return {
              isActive,
            };
          },
          {
            response: t.Object({
              isActive: t.Boolean(),
            }),
          }
        )
    )
    .post(
      "/user/login",
      async (context) => {
        const { fcmToken, identityToken, email, uid, locale, appUserId } =
          context.body;

        try {
          const existingUser = await db.user.findFirst({
            where: {
              OR: [{ id: uid }, { appUserId }],
            },
          });

          if (!existingUser) {
            await db.user.create({
              data: {
                id: uid,
                email,
                fcmToken: fcmToken.length > 0 ? [fcmToken] : [],
                identityToken,
                displayName: "",
                locale,
                appUserId,
              },
            });
            console.log("Anonymous user created");
            return;
          }

          // const updateData: Partial<User> = {
          //   email,
          //   identityToken,
          //   locale,
          //   appUserId,
          //   id: uid,
          // };

          // if (
          //   !existingUser.fcmToken.includes(fcmToken) &&
          //   fcmToken.length > 0
          // ) {
          //   updateData.fcmToken = [...existingUser.fcmToken, fcmToken];
          // }

          // await db.user.update({
          //   where: { id: existingUser.id },
          //   data: updateData,
          // });
        } catch (error) {
          console.error("Error processing user login:", error);
          throw new Error("Failed to process user login");
        }
      },
      {
        body: t.Object({
          appUserId: t.String(),
          uid: t.String(),
          identityToken: t.String(),
          fcmToken: t.String(),
          locale: t.String(),
          email: t.Optional(t.String()),
        }),
      }
    )
    .post(
      "/user/login-apple",
      async (context) => {
        const { fcmToken, identityToken, email, appUserId, locale, uid } =
          context.body;
        try {
          const existingUser = await db.user.findFirst({
            where: {
              appUserId,
            },
          });
          // Check for existing Apple user
          console.log("Checking for existing Apple user with ID:", uid);
          let appleUser = await db.user.findUnique({
            where: { id: uid },
          });
          console.log("Apple user lookup result:", appleUser);

          if (!appleUser) {
            console.log("No Apple user found, checking for existing appUserId");

            console.log("Existing user with appUserId check:", existingUser);

            if (existingUser && existingUser.id !== uid) {
              console.log(
                `Found existing user with appUserId ${appUserId}, updating to avoid conflict`
              );
              await db.user.update({
                where: { id: existingUser.id },
                data: { appUserId: `__${existingUser.appUserId}` },
              });
              console.log("Updated existing user appUserId");
            }

            console.log("Creating new Apple user");
            appleUser = await db.user.create({
              data: {
                id: uid,
                email,
                fcmToken: fcmToken?.length > 0 ? [fcmToken] : [],
                identityToken,
                displayName: "",
                locale,
                appUserId,
                requestsCount: existingUser?.requestsCount || 0,
                expirationAtMs: existingUser?.expirationAtMs || 0,
              },
            });
            console.log("Created new Apple user:", appleUser);
          } else {
            console.log("Existing Apple user found, preparing update");
            const updateData: Partial<User> = {
              email,
              identityToken,
              locale,
            };

            if (!appleUser.fcmToken.includes(fcmToken)) {
              updateData.fcmToken = [...appleUser.fcmToken, fcmToken];
              console.log("Adding new fcmToken to user");
            }

            console.log("Updating existing Apple user with data:", updateData);
            appleUser = await db.user.update({
              where: { id: appleUser.id },
              data: {
                ...updateData,
                requestsCount: {
                  increment: existingUser?.requestsCount || 0,
                },
              },
            });
            console.log("Updated Apple user:", appleUser);
          }

          if (existingUser && existingUser.id !== appleUser.id) {
            console.log("Migrating data from anonymous user:", existingUser.id);

            console.log("Updating chats to new user ID");
            await db.chat.updateMany({
              where: { userId: existingUser.id },
              data: { userId: appleUser.id },
            });
            console.log("Completed chat migration");

            console.log("Updating messages to new user ID");
            await db.message.updateMany({
              where: { userId: existingUser.id },
              data: { userId: appleUser.id },
            });
            console.log("Completed message migration");

            console.log("Checking if anonymous user can be deleted");
            const anonymousUserChats = await db.chat.count({
              where: { userId: existingUser.id },
            });
            console.log("Anonymous user chat count:", anonymousUserChats);

            const anonymousUserMessages = await db.message.count({
              where: { userId: existingUser.id },
            });
            console.log("Anonymous user message count:", anonymousUserMessages);

            if (anonymousUserChats === 0 && anonymousUserMessages === 0) {
              console.log(
                "Deleting anonymous user as no chats or messages remain"
              );
              try {
                await db.user.delete({
                  where: { id: existingUser.id },
                });
                console.log("Successfully deleted anonymous user");
              } catch (deleteError) {
                console.error("Error deleting anonymous user:", deleteError);
              }
            } else {
              console.log(
                "Preserving anonymous user due to remaining chats or messages"
              );
            }
          } else {
            console.log("No migration needed - same user ID");
          }

          console.log(`Apple login completed successfully for user ${uid}`, {
            migratedFrom: existingUser?.id,
            finalUser: appleUser,
          });

          return appleUser;
        } catch (error) {
          console.error("Apple login failed:", {
            error,
            uid,
          });
          throw new Error("Failed to process Apple login");
        }
      },
      {
        body: t.Object({
          uid: t.String(),
          appUserId: t.String(),
          identityToken: t.String(),
          fcmToken: t.String(),
          locale: t.String(),
          email: t.Optional(t.String()),
        }),
      }
    );

  return Promise.resolve(app);
};
