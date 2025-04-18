import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { Cron } from "./cron";

// import { readFileSync } from "fs";
// import path from "path";
import { AdminController } from "./controllers/admin-controller";
import { AnalyticsController } from "./controllers/analytics-controller";
import { ChatController } from "./controllers/chat-controller";
import { DebugController } from "./controllers/debug-controller";
import { RevenueCatController } from "./controllers/revenue-cat-controller";
import { UserController } from "./controllers/user-controller";
import { telegramService } from "./services/telegram";
import { getApplePublicKeys } from "./utils";

const IS_DEV = process.env.NODE_ENV === "development";
// const CERT_DIR = "/etc/letsencrypt/live/darkai.duckdns.org";

// const _tlsOptions = !IS_DEV
//   ? {
//       key: readFileSync(path.join(CERT_DIR, "privkey.pem")),
//       cert: readFileSync(path.join(CERT_DIR, "fullchain.pem")),
//     }
//   : undefined;

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
  .use(DebugController)
  .use(AdminController)
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
  .listen({
    port: process.env.PORT || 3000,
    // tls: tlsOptions,
  });

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
