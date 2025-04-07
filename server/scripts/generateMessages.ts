import { MessageType } from "../prisma/prisma-client-js";
import { prisma } from "../src/db";
// Replace this with your actual userId
const USER_ID = "h4gOAN9Hbqe7DJph80xiIxnDfdZ2"; // e.g., "cl123456789"

// Main function to create chat and messages
async function createTestChatAndMessages() {
  try {
    // Step 1: Create a chat
    const chat = await prisma.chat.create({
      data: {
        id: `chat_${Date.now()}`, // Unique ID for the chat
        userId: USER_ID,
        title: "Test Chat",
        threadId: "thread_123", // Optional, adjust as needed
      },
    });
    console.log("Created chat:", chat);

    // Step 2: Generate 200 messages with "Message #N" text
    const messages = [];
    const baseDate = new Date();
    for (let i = 0; i < 200; i++) {
      const messageNumber = i + 1; // Start from 1 to 200
      const createdAt = new Date(baseDate.getTime() - (200 - i) * 60000); // 1 minute apart, oldest first
      const type = i % 2 === 0 ? MessageType.USER : MessageType.BOT; // Alternate USER and BOT
      messages.push({
        userId: USER_ID,
        text: `Message #${messageNumber}`,
        createdAt,
        type,
        chatId: chat.id,
      });
    }

    // Step 3: Bulk insert messages
    await prisma.message.createMany({
      data: messages,
    });
    console.log(`Created 200 messages for chat ${chat.id}`);

    // Step 4: Verify the data
    const messageCount = await prisma.message.count({
      where: { chatId: chat.id },
    });
    console.log(`Total messages in chat ${chat.id}: ${messageCount}`);

    const sampleMessages = await prisma.message.findMany({
      where: { chatId: chat.id },
      take: 5,
      orderBy: { createdAt: "asc" },
    });
    console.log("Sample messages:", sampleMessages);
  } catch (error) {
    console.error("Error creating test data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createTestChatAndMessages();
