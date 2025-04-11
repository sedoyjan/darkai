import Elysia, { t } from "elysia";
import { db } from "../db";
import { isAuthenticated } from "../middlewares/auth";
import { User } from "../../prisma/prisma-client-js";

export const UserController = (app: Elysia) => {
  app
    .group("/user", (app) =>
      app
        .use(isAuthenticated)
        .post(
          "/login-apple",
          async (context) => {
            const { fcmToken, identityToken, email, appUserId, locale, uid } =
              context.body;
            const anonymousUserId = context.user.id;

            try {
              const result = await db.$transaction(async (tx) => {
                let appleUser = await tx.user.findUnique({
                  where: { id: uid },
                });

                if (!appleUser) {
                  const existingUser = await tx.user.findFirst({
                    where: {
                      appUserId,
                    },
                  });

                  if (existingUser && existingUser.id !== uid) {
                    console.log(
                      `User with appUserId ${appUserId} already exists.`
                    );
                    await tx.user.update({
                      where: { id: existingUser.id },
                      data: {
                        appUserId: `__${existingUser.appUserId}`,
                      },
                    });
                  }

                  appleUser = await tx.user.create({
                    data: {
                      id: uid,
                      email,
                      fcmToken: [fcmToken],
                      identityToken,
                      displayName: "",
                      locale,
                      appUserId,
                    },
                  });
                } else {
                  const updateData: Partial<User> = {
                    email,
                    identityToken,
                    locale,
                  };

                  if (!appleUser.fcmToken.includes(fcmToken)) {
                    updateData.fcmToken = [...appleUser.fcmToken, fcmToken];
                  }

                  appleUser = await tx.user.update({
                    where: { id: appleUser.id },
                    data: updateData,
                  });
                }

                if (anonymousUserId !== appleUser.id) {
                  await tx.chat.updateMany({
                    where: { userId: anonymousUserId },
                    data: { userId: appleUser.id },
                  });

                  await tx.message.updateMany({
                    where: { userId: anonymousUserId },
                    data: { userId: appleUser.id },
                  });

                  const anonymousUserChats = await tx.chat.count({
                    where: { userId: anonymousUserId },
                  });

                  const anonymousUserMessages = await tx.message.count({
                    where: { userId: anonymousUserId },
                  });

                  if (anonymousUserChats === 0 && anonymousUserMessages === 0) {
                    await tx.user.delete({
                      where: { id: anonymousUserId },
                    }).catch((error) => {
                      console.log(
                        "🚀 ~ /user/login-apple ~ db.user.delete error:",
                        error
                      );
                    })
                  }
                }

                return appleUser;
              });

              console.log(
                `User ${appUserId} logged in with Apple, data migrated from anonymous user ${anonymousUserId}`
              );

              console.log({ success: true, userId: result.id });
              return;
            } catch (error) {
              console.error("Error in Apple login:", error);
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
        )
        .get(
          "/me",
          async ({ user }) => {
            const userRecord = await db.user.findFirst({
              where: {
                id: user.id,
              },
            });

            const FREE_REQUESTS_LIMIT = 15;

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
          await db.user.delete({
            where: {
              id: user.id,
            },
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
              OR: [{ id: uid }, { appUserId: appUserId }],
            },
          });

          if (!existingUser) {
            await db.user.create({
              data: {
                id: uid,
                email,
                fcmToken: [fcmToken],
                identityToken,
                displayName: "",
                locale,
                appUserId,
              },
            });
            console.log("Anonymous user created");
            return;
          }

          const updateData: Partial<User> = {
            email,
            identityToken,
            locale,
            appUserId,
            id: uid,
          };

          if (!existingUser.fcmToken.includes(fcmToken)) {
            updateData.fcmToken = [...existingUser.fcmToken, fcmToken];
          }

          await db.user.update({
            where: { id: existingUser.id },
            data: updateData,
          });
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
    );

  return Promise.resolve(app);
};
