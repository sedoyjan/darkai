import Elysia, { t } from "elysia";
import { getAiResponse } from "../ai";
import { db } from "../db";
import { sendNotification } from "../services/firebase";

export const DebugController = (app: Elysia) => {
  app.group("/debug", (app) => {
    return app.get(
      "/follow-up",
      async () => {
        console.log("Starting follow-up debug process...");

        const followUpDelayHours = 1; // Задержка в часах (24–48)
        const maxFollowUps = 2; // Максимальное количество follow-up сообщений

        // Находим все чаты, где можно отправить follow-up
        const chats = await db.chat.findMany({
          where: {
            followUpCount: { lt: maxFollowUps }, // Только чаты с менее чем 2 follow-up
          },
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1, // Последнее сообщение
            },
            user: true, // Для отправки push-уведомления
          },
        });

        const now = new Date();
        const followUpDelayMs = followUpDelayHours * 60 * 60 * 1000; // Переводим часы в миллисекунды

        let processedChats = 0;
        let sentFollowUps = 0;

        for (const chat of chats) {
          processedChats++;

          const lastMessage = chat.messages[0];
          if (!lastMessage) continue; // Пропускаем пустые чаты

          const lastMessageTime = new Date(lastMessage.createdAt).getTime();
          const timeSinceLastMessage = now.getTime() - lastMessageTime;

          // Проверяем, прошло ли достаточно времени и не отправлялось ли уже follow-up недавно
          const lastFollowUpSentAt = chat.lastFollowUpSentAt
            ? new Date(chat.lastFollowUpSentAt).getTime()
            : null;
          const timeSinceLastFollowUp = lastFollowUpSentAt
            ? now.getTime() - lastFollowUpSentAt
            : null;

          if (
            timeSinceLastMessage >= followUpDelayMs &&
            (!timeSinceLastFollowUp || timeSinceLastFollowUp >= followUpDelayMs)
          ) {
            // Получаем последние 2–4 сообщения для контекста
            const recentMessages = await db.message.findMany({
              where: { chatId: chat.id },
              orderBy: { createdAt: "desc" },
              take: 4,
            });

            const FOLLOWUP_ASSISTANT_ID = process.env
              .OPENAI_API_FOLLOWUP_ASSISTANT_ID as string;

            const text = recentMessages
              .map((msg) => {
                if (msg.type === "USER") {
                  return `User: ${msg.text}`;
                } else if (msg.type === "BOT") {
                  return `Assistant: ${msg.text}`;
                }
                return "";
              })
              .join("\n");
            console.log("Recent messages for follow-up:", text);

            const { data: followUpText } = await getAiResponse(
              FOLLOWUP_ASSISTANT_ID,
              text
            );

            // Сохраняем follow-up сообщение в чат
            await db.message.create({
              data: {
                text: followUpText,
                type: "BOT",
                chat: { connect: { id: chat.id } },
                user: { connect: { id: chat.userId } },
              },
            });

            // Обновляем чат: добавляем timestamp и увеличиваем счётчик follow-up
            await db.chat.update({
              where: { id: chat.id },
              data: {
                lastFollowUpSentAt: now,
                followUpCount: { increment: 1 },
                updatedAt: now,
              },
            });

            const tokens = chat.user.fcmToken || [];

            for (const token of tokens) {
              sendNotification({
                fcmToken: token,
                title: "DarkAI Sway: Follow-up",
                message: followUpText,
              }).catch((error) => {
                console.error("Error sending notification:", error);
              });
            }

            sentFollowUps++;
            console.log(`Follow-up sent for chat ${chat.id}: ${followUpText}`);
          }
        }

        console.log("Follow-up debug process completed.");
        return {
          success: true,
          processedChats,
          sentFollowUps,
        };
      },
      {
        response: t.Object({
          success: t.Boolean(),
          processedChats: t.Number(),
          sentFollowUps: t.Number(),
        }),
      }
    );
  });

  return Promise.resolve(app);
};
