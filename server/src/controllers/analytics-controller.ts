import Elysia, { t } from "elysia";
import { telegramService } from "../services/telegram";

export const AnalyticsController = (app: Elysia) => {
  app.group("/analytics", (app) => {
    return app.post(
      "/launch",
      async (context) => {
        const {} = context.body;
        console.log("/analytics/launch");
        telegramService.sendMessage("🚀 Launch event");
        return { success: true };
      },
      {
        body: t.Object({}),
        response: t.Object({
          success: t.Boolean(),
        }),
      }
    );
  });

  return Promise.resolve(app);
};
