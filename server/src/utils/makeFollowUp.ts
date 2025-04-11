import { getAiResponse } from "../ai";
import { db } from "../db";
import { sendNotification } from "../services/firebase";

export async function makeFollowUp(userId?: string) {
  const followUpDelayHours = 0; // Configurable delay (0 for debug, can be 24 in production)
  const maxFollowUps = userId ? 999 : 3; // Maximum number of follow-ups per chat

  // Fetch chats, filtered by userId if provided, ordered by updatedAt to get the latest first
  const chats = await db.chat.findMany({
    where: {
      ...(userId ? { userId } : {}), // Filter by userId if provided
      followUpCount: { lt: maxFollowUps }, // Only fetch chats with fewer than max follow-ups
    },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1, // Get the latest message to check timing
      },
      user: true, // Include user for FCM token
    },
    orderBy: { updatedAt: "desc" }, // Sort by most recently updated
  });

  const now = new Date();
  const followUpDelayMs = followUpDelayHours * 60 * 60 * 1000;

  // Process chats one by one until a follow-up is sent or no eligible chats are found
  for (const chat of chats) {
    const lastMessage = chat.messages[0];
    if (!lastMessage) continue; // Skip if no messages exist

    const lastMessageTime = new Date(lastMessage.createdAt).getTime();
    const timeSinceLastMessage = now.getTime() - lastMessageTime;

    const lastFollowUpSentAt = chat.lastFollowUpSentAt
      ? new Date(chat.lastFollowUpSentAt).getTime()
      : null;
    const timeSinceLastFollowUp = lastFollowUpSentAt
      ? now.getTime() - lastFollowUpSentAt
      : null;

    // Check if the chat is eligible for a follow-up
    if (
      timeSinceLastMessage >= followUpDelayMs &&
      (!timeSinceLastFollowUp || timeSinceLastFollowUp >= followUpDelayMs)
    ) {
      // Fetch recent messages for context
      const recentMessages = await db.message.findMany({
        where: { chatId: chat.id },
        orderBy: { createdAt: "desc" },
        take: 4,
      });

      const FOLLOWUP_ASSISTANT_ID = process.env
        .OPENAI_API_FOLLOWUP_ASSISTANT_ID as string;

      // Format recent messages for the AI
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

      // Get follow-up message from AI
      const { data: followUpText } = await getAiResponse(
        FOLLOWUP_ASSISTANT_ID,
        text
      );

      // Save the follow-up message
      await db.message.create({
        data: {
          text: followUpText,
          type: "BOT",
          chat: { connect: { id: chat.id } },
          user: { connect: { id: chat.userId } },
        },
      });

      // Update chat with follow-up details
      await db.chat.update({
        where: { id: chat.id },
        data: {
          lastFollowUpSentAt: now,
          followUpCount: { increment: 1 },
          updatedAt: now,
        },
      });

      // Send notification to the user
      const tokens = (chat.user.fcmToken || []).filter((t) => t?.length > 0); // Filter out empty tokens
      for (const token of tokens) {
        await sendNotification({
          fcmToken: token,
          title: "DarkAI: Follow-up",
          message: followUpText,
          data: {
            chatId: chat.id,
          },
        }).catch((error) => {
          console.error("Error sending notification:", error);
        });
      }

      console.log(`Follow-up sent for chat ${chat.id}: ${followUpText}`);
      return {
        success: true,
        chatId: chat.id,
        followUpSent: true,
      };
    }
  }

  // If no eligible chats were found
  return {
    success: true,
    chatId: null,
    followUpSent: false,
  };
}
