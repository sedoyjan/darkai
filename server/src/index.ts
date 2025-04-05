import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { Cron } from "./cron";

import { AnalyticsController } from "./controllers/analytics-controller";
import { UserController } from "./controllers/user-controller";
import { getApplePublicKeys } from "./utils";
import { RevenueCatController } from "./controllers/revenue-cat-controller";
import { telegramService } from "./services/telegram";
import { ChatController } from "./controllers/chat-controller";

const IS_DEV = process.env.NODE_ENV === "development";

export const app = new Elysia()
  .state({ appleKeys: [], userIds: { uid: "id" } })
  .use(cors());

if (IS_DEV) {
  app.use(
    swagger({
      provider: "scalar",
      documentation: {
        components: {
          securitySchemes: {
            JwtAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description: "Enter JWT Bearer token **_only_**",
            },
          },
        },
      },
    })
  );
}

app
  .use(AnalyticsController)
  .use(UserController)
  .use(RevenueCatController)
  .use(ChatController)
  .use(Cron)
  .onError(({ code }) => {
    if (code === "NOT_FOUND") return "Route not found :(";
  })
  .onStart(async ({ store }) => {
    store.appleKeys = await getApplePublicKeys();
    if (!IS_DEV) {
      telegramService.createBot();
    }
  })
  .listen(process.env.PORT || 3000);

export type ElysiaApp = typeof app;

console.log(
  `🤖 DarkAI server started at ${new Date().toLocaleString()} and running at http://${
    app.server?.hostname
  }:${app.server?.port}`
);
if (IS_DEV) {
  console.log(
    `🚀 Swagger is running at http://${app.server?.hostname}:${app.server?.port}/swagger`
  );
}
