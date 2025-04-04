import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

const IS_DEV = process.env.NODE_ENV === "development";
const BOT_TOKEN = process.env.BOT_TOKEN as string;
const ADMIN_ID = 27843084;

class TelegramService {
  chatIds: number[] = [];
  bot: Telegraf | null = null;

  async createBot() {
    this.bot = new Telegraf(BOT_TOKEN);
    this.bot.start((ctx) => {
      if (ctx.update.message.from.id === ADMIN_ID) {
        this.chatIds.push(ctx.chat.id);
        console.log("chatIds", ctx.chat.id);

        return ctx.reply(`Welcome ${ctx.update.message.from.first_name}`);
      }
    });
    this.bot.on(message("sticker"), (ctx) => ctx.reply("👍"));

    this.bot.action("send", (ctx) => {
      return ctx.reply("send reply");
    });
    this.bot.command("hipster", Telegraf.reply("λ"));
    this.start();
  }

  async start() {
    if (!this.bot && !IS_DEV) {
      throw new Error("Bot is not initialized");
    }
    this.bot
      ?.launch()
      .then(() => console.log("Bot started"))
      .catch(console.error);
  }

  async sendMessage(message: string) {
    if (!this.bot && !IS_DEV) {
      throw new Error("Bot is not initialized");
    }
    const chatId = 27843084;
    this.bot?.telegram.sendMessage(chatId, message);
    // this.chatIds.forEach((chatId) => {});
  }
}

export const telegramService = new TelegramService();
