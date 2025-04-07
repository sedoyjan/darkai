import Elysia, { t } from "elysia";

export const AdminController = (app: Elysia) => {
  app.group("/admin", (app) => {
    return app.get(
      "/test",
      async () => {
        console.log("Testing admin endpoint...");
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
