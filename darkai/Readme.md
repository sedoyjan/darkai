# Info

dark.ai.app@outlook.com

# Docs

https://app-privacy-policy-generator.firebaseapp.com/

# Hints

For some reason screenshots for the Subscriptions reviews should be 2208 x 1242 pixels. I'm not sure why.



 const response = Notifications.useLastNotificationResponse();
  console.log('🚀 ~ RootLayout ~ response:', response);

  useEffect(() => {
    const chatId = get(
      response,
      'notification.request.trigger.payload.chatId',
      null,
    );
    if (chatId) {
      navigateToChat(chatId as string);
      Notifications.clearLastNotificationResponseAsync();
    }
  }, [response]);