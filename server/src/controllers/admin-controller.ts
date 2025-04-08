import Elysia, { t } from "elysia";
import { isAuthenticated } from "../middlewares/auth";
import { makeFollowUp } from "../utils/makeFollowUp";

export const AdminController = (app: Elysia) => {
  app.group("/admin", (app) => {
    return app.use(isAuthenticated).post(
      "/test-follow-up",
      async ({ user }) => {
        console.log("Testing admin follow up endpoint...", user.id);
        setTimeout(() => {
          makeFollowUp(user.id);
        }, 5000);
        return {
          success: true,
        };
      },
      {
        response: t.Object({
          success: t.Boolean(),
        }),
      }
    );
  });

  return Promise.resolve(app);
};
