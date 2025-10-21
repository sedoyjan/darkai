import { makeFollowUp } from "../src/utils/makeFollowUp";

/**
 * Test script for follow-up system
 * Run with: bun run scripts/testFollowUpCron.ts
 * 
 * This script helps you test the follow-up logic without waiting for the cron
 */

const main = async () => {
  console.log("🧪 Testing Follow-Up System...\n");
  console.log("Environment Variables:");
  console.log(`  IS_SEND_FOLLOW_UP: ${process.env.IS_SEND_FOLLOW_UP}`);
  console.log(`  OPENAI_API_FOLLOWUP_ASSISTANT_ID: ${process.env.OPENAI_API_FOLLOWUP_ASSISTANT_ID ? '✅ Set' : '❌ Not Set'}\n`);

  console.log("📊 Progressive Delay Strategy:");
  console.log("  Follow-up 1: 24 hours (1 day) after last message");
  console.log("  Follow-up 2: 48 hours (2 days) after 1st follow-up");
  console.log("  Follow-up 3: 168 hours (1 week) after 2nd follow-up");
  console.log("  Follow-up 4: 336 hours (2 weeks) after 3rd follow-up");
  console.log("  After 4: Stop sending\n");

  console.log("🔍 Running makeFollowUp()...\n");
  
  try {
    const result = await makeFollowUp();
    
    console.log("\n📋 Result:");
    console.log(JSON.stringify(result, null, 2));
    
    if (result.followUpSent) {
      console.log("\n✅ Success! Follow-up was sent to chat:", result.chatId);
      console.log(`   Follow-up count: ${result.followUpCount}`);
    } else {
      console.log("\n⏰ No eligible chats found for follow-up at this time.");
      console.log("\nPossible reasons:");
      console.log("  • No chats exist in database");
      console.log("  • All chats have reached max follow-ups (4)");
      console.log("  • Not enough time has passed since last message/follow-up");
    }
  } catch (error) {
    console.error("\n❌ Error:", error);
  }

  console.log("\n✨ Test complete!");
  process.exit(0);
};

main();

