import cron, { Patterns } from "@elysiajs/cron";
import Elysia from "elysia";

const toMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);

export const Cron = (app: Elysia) => {
  app.use(
    cron({
      name: "heartbeat",
      pattern: Patterns.everySenconds(30),
      run() {
        const memoryUsage = process.memoryUsage();
        console.log("Memory Usage Resident_Set_Size:", toMB(memoryUsage.rss));
      },
    })
  );
  return Promise.resolve(app);
};
