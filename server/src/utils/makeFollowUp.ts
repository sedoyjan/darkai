import { getAiResponse } from "../ai";
import { db } from "../db";
import { sendNotification } from "../services/firebase";

export async function makeFollowUp(userId?: string) {
  const maxFollowUps = 4; // Maximum number of follow-ups per chat (0, 1, 2, 3)
  const IS_SEND_FOLLOW_UP = process.env.IS_SEND_FOLLOW_UP === "true";

  // Progressive delay strategy in hours:
  // followUpCount 0: 24 hours (1 day)
  // followUpCount 1: 48 hours (2 days)
  // followUpCount 2: 168 hours (7 days / 1 week)
  // followUpCount 3: 336 hours (14 days / 2 weeks)
  const getDelayHours = (followUpCount: number): number => {
    switch (followUpCount) {
      case 0:
        return 24; // 1 day after last message
      case 1:
        return 48; // 2 days after first follow-up
      case 2:
        return 168; // 1 week after second follow-up
      case 3:
        return 336; // 2 weeks after third follow-up
      default:
        return Infinity; // Don't send anymore
    }
  };

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

  // Process chats one by one until a follow-up is sent or no eligible chats are found
  for (const chat of chats) {
    const lastMessage = chat.messages[0];
    if (!lastMessage) continue; // Skip if no messages exist

    const delayHours = getDelayHours(chat.followUpCount);
    const followUpDelayMs = delayHours * 60 * 60 * 1000;

    const lastMessageTime = new Date(lastMessage.createdAt).getTime();
    const timeSinceLastMessage = now.getTime() - lastMessageTime;

    const lastFollowUpSentAt = chat.lastFollowUpSentAt
      ? new Date(chat.lastFollowUpSentAt).getTime()
      : null;
    const timeSinceLastFollowUp = lastFollowUpSentAt
      ? now.getTime() - lastFollowUpSentAt
      : null;

    // For first follow-up, check time since last message
    // For subsequent follow-ups, check time since last follow-up
    const isEligible = chat.followUpCount === 0
      ? timeSinceLastMessage >= followUpDelayMs
      : timeSinceLastFollowUp !== null && timeSinceLastFollowUp >= followUpDelayMs;

    // Check if the chat is eligible for a follow-up
    if (isEligible) {
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

      // Send notification to the user (or just log if IS_SEND_FOLLOW_UP is false)
      if (IS_SEND_FOLLOW_UP) {
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
        console.log(`✅ Follow-up sent for chat ${chat.id} (count: ${chat.followUpCount + 1}): ${followUpText}`);
      } else {
        console.log(`📝 [DRY RUN] Follow-up would be sent for chat ${chat.id} (count: ${chat.followUpCount + 1}): ${followUpText}`);
      }

      return {
        success: true,
        chatId: chat.id,
        followUpSent: true,
        followUpCount: chat.followUpCount + 1,
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
