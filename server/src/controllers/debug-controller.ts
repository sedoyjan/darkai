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

        const followUpDelayHours = 0;
        const maxFollowUps = 2;

        const chats = await db.chat.findMany({
          where: {
            followUpCount: { lt: maxFollowUps },
          },
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
            user: true,
          },
        });

        const now = new Date();
        const followUpDelayMs = followUpDelayHours * 60 * 60 * 1000;

        let processedChats = 0;
        let sentFollowUps = 0;

        for (const chat of chats) {
          processedChats++;

          const lastMessage = chat.messages[0];
          if (!lastMessage) continue;

          const lastMessageTime = new Date(lastMessage.createdAt).getTime();
          const timeSinceLastMessage = now.getTime() - lastMessageTime;

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

            const { data: followUpText } = await getAiResponse(
              FOLLOWUP_ASSISTANT_ID,
              text
            );

            await db.message.create({
              data: {
                text: followUpText,
                type: "BOT",
                chat: { connect: { id: chat.id } },
                user: { connect: { id: chat.userId } },
              },
            });

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
