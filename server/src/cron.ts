import cron, { Patterns } from "@elysiajs/cron";
import Elysia from "elysia";
import { makeFollowUp } from "./utils/makeFollowUp";

const toMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);

export const Cron = (app: Elysia) => {
  app.use(
    cron({
      name: "heartbeat",
      pattern: Patterns.everySenconds(30),
      run() {
        const memoryUsage = process.memoryUsage();
        // console.log("Memory Usage Resident_Set_Size:", toMB(memoryUsage.rss));
      },
    })
  );

  // Follow-up cron job - runs every minute
  app.use(
    cron({
      name: "follow-up-messages",
      pattern: Patterns.everyMinute(),
      async run() {
        try {
          const result = await makeFollowUp();
          if (result.followUpSent) {
            console.log(`🔔 Follow-up cron: Follow-up sent to chat ${result.chatId}`);
          } else {
            console.log(`⏰ Follow-up cron: No eligible chats for follow-up at ${new Date().toISOString()}`);
          }
        } catch (error) {
          console.error("❌ Follow-up cron error:", error);
        }
      },
    })
  );

  return Promise.resolve(app);
};
