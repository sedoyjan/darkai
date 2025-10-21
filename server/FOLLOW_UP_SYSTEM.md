# Follow-Up System Documentation

## Overview
The follow-up system automatically sends re-engagement messages to users based on a progressive delay strategy, ensuring users stay engaged without being annoying.

## Progressive Delay Strategy

The system implements a smart escalation pattern:

| Follow-Up # | Delay After Previous | Total Time Since Initial Message |
|------------|---------------------|----------------------------------|
| 1st | 24 hours (1 day) | 1 day |
| 2nd | 48 hours (2 days) | 3 days |
| 3rd | 168 hours (1 week) | 10 days |
| 4th | 336 hours (2 weeks) | 24 days |
| After 4th | No more follow-ups | - |

### Logic Details

- **First follow-up (count=0)**: Waits 24 hours after the user's last message
- **Subsequent follow-ups (count=1-3)**: Waits the specified delay after the previous follow-up was sent
- **Maximum**: 4 total follow-ups, then stops permanently for that chat

## Environment Variables

### Required
```bash
# OpenAI Assistant ID for generating follow-up messages
OPENAI_API_FOLLOWUP_ASSISTANT_ID=asst_xxxxx

# Enable/disable push notifications (for testing)
IS_SEND_FOLLOW_UP=false  # Set to "true" to enable push notifications
```

When `IS_SEND_FOLLOW_UP=false`:
- Follow-up messages are still created in the database
- Push notifications are NOT sent
- Console logs show: `📝 [DRY RUN] Follow-up would be sent...`

When `IS_SEND_FOLLOW_UP=true`:
- Follow-up messages are created in the database
- Push notifications ARE sent via Firebase Cloud Messaging
- Console logs show: `✅ Follow-up sent for chat...`

## Database Schema

The `Chat` model tracks follow-up state:

```prisma
model Chat {
  id                 String    @id
  lastFollowUpSentAt DateTime?  // When the last follow-up was sent
  followUpCount      Int       @default(0)  // Number of follow-ups sent (0-3)
  // ... other fields
}
```

## Cron Job

The system runs automatically every minute:

```typescript
// Runs every 60 seconds
pattern: Patterns.everyMinute()
```

### Cron Behavior
- Checks all chats eligible for follow-ups
- Sends ONE follow-up per execution
- Logs results:
  - `🔔 Follow-up cron: Follow-up sent to chat {id}` - Success
  - `⏰ Follow-up cron: No eligible chats...` - No action needed
  - `❌ Follow-up cron error:` - Error occurred

## Files Modified

1. **`/src/utils/makeFollowUp.ts`** - Core follow-up logic with progressive delays
2. **`/src/cron.ts`** - Cron job that runs every minute
3. **`/src/controllers/admin-controller.ts`** - Existing manual trigger endpoint
4. **`/src/controllers/debug-controller.ts`** - Existing debug endpoint

## API Endpoints

### Manual Testing Endpoints

#### 1. Admin Test Follow-Up
```
POST /admin/test-follow-up
Authorization: Bearer {token}
```

Triggers a follow-up for the authenticated user after 5 seconds.

#### 2. Debug Follow-Up
```
GET /debug/follow-up
```

Runs follow-up logic for all eligible chats immediately. Returns:
```json
{
  "success": true,
  "processedChats": 10,
  "sentFollowUps": 2
}
```

## How It Works

1. **Cron Trigger**: Every minute, the cron job calls `makeFollowUp()`
2. **Fetch Eligible Chats**: Queries chats where `followUpCount < 4`
3. **Check Timing**: For each chat, calculates if enough time has passed
4. **Generate Message**: Uses OpenAI to generate contextual follow-up based on last 4 messages
5. **Save & Send**: 
   - Saves message to database
   - Increments `followUpCount`
   - Updates `lastFollowUpSentAt`
   - Sends push notification (if enabled)
6. **Stop After One**: Returns after sending one follow-up per cron run

## Testing the System

### Step 1: Set Up Environment
```bash
# For testing without sending real notifications
echo "IS_SEND_FOLLOW_UP=false" >> .env

# For production with real notifications
echo "IS_SEND_FOLLOW_UP=true" >> .env
```

### Step 2: Start the Server
```bash
bun run dev
```

### Step 3: Monitor Logs
Watch for these messages every minute:
```
⏰ Follow-up cron: No eligible chats for follow-up at 2025-10-21T...
📝 [DRY RUN] Follow-up would be sent for chat abc123 (count: 1): [message]
```

### Step 4: Test Manually
```bash
# Trigger follow-up for specific user (requires auth token)
curl -X POST http://localhost:3000/admin/test-follow-up \
  -H "Authorization: Bearer YOUR_TOKEN"

# Run debug endpoint (no auth needed)
curl http://localhost:3000/debug/follow-up
```

## Production Checklist

- [ ] Set `IS_SEND_FOLLOW_UP=true` in production environment
- [ ] Verify `OPENAI_API_FOLLOWUP_ASSISTANT_ID` is configured
- [ ] Test with a few users first (use `IS_SEND_FOLLOW_UP=false`)
- [ ] Monitor logs for errors
- [ ] Verify Firebase Cloud Messaging is properly configured
- [ ] Check that users have valid FCM tokens

## Troubleshooting

### Follow-ups not being sent
1. Check `IS_SEND_FOLLOW_UP` environment variable
2. Verify chats have messages and `followUpCount < 4`
3. Check timing: Has enough time passed based on progressive delays?
4. Look for errors in logs

### Push notifications not received
1. Ensure `IS_SEND_FOLLOW_UP=true`
2. Verify user has valid FCM tokens in database
3. Check Firebase configuration
4. Review notification error logs

### Too many follow-ups
- Verify `followUpCount` is being incremented correctly
- Check `lastFollowUpSentAt` timestamp is being updated
- Ensure cron is not running multiple times

## Future Improvements

- [ ] Add time-of-day restrictions (e.g., don't send at night)
- [ ] Implement user preferences for follow-up frequency
- [ ] A/B test different delay strategies
- [ ] Add analytics tracking for follow-up engagement
- [ ] Implement timezone-aware scheduling

