import Elysia, { t } from "elysia";
import { db } from "../db";
import { isAuthenticated } from "../middlewares/auth";

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

            const hasFreeRequests = userRecord
              ? userRecord.requestsCount < 3
              : false;

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
              200: t.Null(), // Define success response schema
              401: t.Object({ error: t.String() }), // Define unauthorized response schema
            },
            // tags: ["User"],
            summary: "Update user locale",
            description:
              "Endpoint to update the locale of the authenticated user",
            // security: [{ bearerAuth: [] }],
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

        const existingUser = await db.user.findFirst({
          where: {
            OR: [
              {
                id: uid,
              },
              {
                appUserId: appUserId,
              },
            ],
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
              appUserId: appUserId,
            },
          });
        } else {
          if (!existingUser.fcmToken.includes(fcmToken)) {
            await db.user.update({
              where: {
                id: existingUser.id,
              },
              data: {
                fcmToken: {
                  push: fcmToken,
                },
              },
            });
          }
          await db.user
            .update({
              where: {
                id: existingUser.id,
              },
              data: {
                appUserId: appUserId,
                email,
                identityToken,
                locale,
              },
            })
            .catch((error) => {
              console.error("🚀 ~ await db.user.update({ error", error);
            });
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
