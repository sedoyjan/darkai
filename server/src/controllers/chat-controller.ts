import Elysia, { t } from "elysia";
import { Message, MessageType } from "../../prisma/prisma-client-js";
import { MessagePlain } from "../../prismaModels/Message";
import { isAuthenticated } from "../middlewares/auth";
import { db } from "../db";
import { getAiResponse } from "../ai";
import { ChatPlain } from "../../prismaModels/Chat";

const formatDate = (date: Date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export const ChatController = (app: Elysia) => {
  app.group("/chat", (app) =>
    app
      .use(isAuthenticated)
      // Проверка лимита сообщений для freemium-модели
      .onBeforeHandle(async ({ user, set }) => {
        const freeMessageLimit = 4; // Лимит бесплатных сообщений
        const userData = await db.user.findUnique({
          where: { id: user.id },
        });

        if (!userData) {
          set.status = 404;
          return { error: "User not found" };
        }
        console.log("User data:", userData);
        // Проверяем, если у пользователя нет активной подписки и превышен лимит
        // if (
        //   !userData.hasActiveSubscription &&
        //   userData.requestsCount >= freeMessageLimit
        // ) {
        //   set.status = 403;
        //   return { error: "Free message limit exceeded. Please subscribe." };
        // }
      })
      .post(
        "/sendMessage",
        async ({ body, user }) => {
          const { chatId, text } = body;

          const chat = await db.chat.findFirst({
            where: {
              id: chatId,
              userId: user.id,
            },
          });
          if (!chat) {
            await db.chat.create({
              data: {
                id: chatId,
                userId: user.id,
                title: text,
                messages: {
                  create: {
                    text: body.text,
                    type: MessageType.USER,
                    user: {
                      connect: {
                        id: user.id,
                      },
                    },
                  },
                },
              },
            });
          } else {
            await db.message.create({
              data: {
                text: body.text,
                type: MessageType.USER,
                chat: {
                  connect: {
                    id: chatId,
                  },
                },
                user: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            });
          }

          const latestChat = await db.chat.findFirst({
            where: {
              id: chatId,
              userId: user.id,
            },
          });

          const prevThreadId = latestChat?.threadId;

          const STATEGY_ASSISTANT_ID = process.env
            .OPENAI_API_STRATEGY_ASSISTANT_ID as string;

          const { data: responseMessageText, threadId } = await getAiResponse(
            STATEGY_ASSISTANT_ID,
            body.text,
            prevThreadId || undefined
          );

          const [responseMessage] = await Promise.all([
            db.message.create({
              data: {
                text: responseMessageText,
                type: MessageType.BOT,
                chat: {
                  connect: {
                    id: chatId,
                  },
                },
                user: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            }),
            db.chat.update({
              where: {
                id: chatId,
              },
              data: {
                threadId,
              },
            }),
            db.user.update({
              where: {
                id: user.id,
              },
              data: {
                requestsCount: {
                  increment: 1,
                },
              },
            }),
          ]);

          return {
            message: responseMessage,
            threadId,
          };
        },
        {
          body: t.Object({
            chatId: t.String(),
            text: t.String(),
            type: t.String(),
            locale: t.String(),
          }),
          response: t.Object({
            message: MessagePlain,
            threadId: t.String(),
          }),
          detail: {
            // tags: ["Chat"],
          },
        }
      )
      // Обновлённый метод /getMessages
      .get(
        "/getMessages",
        async ({ user, query }) => {
          // console.time("Get messages");
          const { chatId, page = 1, limit = 10 } = query;
          const skip = (page - 1) * limit;

          // Проверяем, что чат принадлежит пользователю
          const chat = await db.chat.findFirst({
            where: {
              id: chatId,
              userId: user.id,
            },
          });

          if (!chat) {
            throw new Error("Chat not found");
          }

          // Получаем общее количество сообщений в чате
          const totalMessages = await db.message.count({
            where: {
              chatId,
              userId: user.id,
            },
          });

          // Получаем сообщения для конкретного чата
          const messages = await db.message.findMany({
            where: {
              chatId,
              userId: user.id,
            },
            orderBy: {
              createdAt: "desc",
            },
            skip,
            take: limit,
          });

          const messagesWithSystem: Message[] = [];
          let lastDate: Date | null = null;

          messages.forEach((message) => {
            const messageDate = formatDate(message.createdAt);
            const lastDateStr = lastDate ? formatDate(lastDate) : null;

            if (lastDate && lastDateStr !== messageDate) {
              messagesWithSystem.push({
                id: `system-${lastDateStr}`,
                text: lastDate.toISOString(),
                type: MessageType.SYSTEM,
                createdAt: lastDate,
                userId: user.id,
                chatId,
              });
            }
            lastDate = message.createdAt;
            messagesWithSystem.push(message);
          });

          return {
            messages: messagesWithSystem,
            pagination: {
              page,
              limit,
              totalMessages,
              totalPages: Math.ceil(totalMessages / limit),
            },
          };
        },
        {
          query: t.Object({
            chatId: t.String(),
            page: t.Optional(t.Number()),
            limit: t.Optional(t.Number()),
          }),
          response: t.Object({
            messages: t.Array(MessagePlain),
            pagination: t.Object({
              page: t.Number(),
              limit: t.Number(),
              totalMessages: t.Number(),
              totalPages: t.Number(),
            }),
          }),
          detail: {
            // tags: ["Chat"],
          },
        }
      )

      .get(
        "/getChats",
        async ({ user }) => {
          const chats = await db.chat.findMany({
            where: {
              userId: user.id,
            },
            orderBy: {
              updatedAt: "desc",
            },
          });

          return chats;
        },
        {
          response: t.Array(ChatPlain),
          detail: {
            // tags: ["Chat"],
          },
        }
      )
      // Новый метод /getChat
      .get(
        "/getChat",
        async ({ user, query }) => {
          const { chatId } = query;

          const chat = await db.chat.findFirst({
            where: {
              id: chatId,
              userId: user.id,
            },
            include: {
              messages: {
                orderBy: {
                  createdAt: "desc",
                },
                take: 1, // Последнее сообщение для предпросмотра
              },
            },
          });

          if (!chat) {
            throw new Error("Chat not found");
          }

          return {
            id: chat.id,
            title: chat.title,
            threadId: chat.threadId,
            updatedAt: chat.updatedAt,
            lastMessage: chat.messages[0] || null,
          };
        },
        {
          query: t.Object({
            chatId: t.String(),
          }),
          response: t.Object({
            id: t.String(),
            title: t.String(),
            threadId: t.Optional(t.String()),
            updatedAt: t.String(),
            lastMessage: t.Optional(MessagePlain),
          }),
          detail: {
            // tags: ["Chat"],
          },
        }
      )
      // Новый метод /deleteChat
      .delete(
        "/deleteChat",
        async ({ user, query }) => {
          const { chatId } = query;

          const chat = await db.chat.findFirst({
            where: {
              id: chatId,
              userId: user.id,
            },
          });

          if (!chat) {
            throw new Error("Chat not found");
          }

          await db.chat.delete({
            where: {
              id: chatId,
            },
          });

          return { success: true };
        },
        {
          query: t.Object({
            chatId: t.String(),
          }),
          response: t.Object({
            success: t.Boolean(),
          }),
          detail: {
            // tags: ["Chat"],
          },
        }
      )
      .put(
        "/rename-chat",
        async ({ user, body }) => {
          const { chatId, newTitle } = body;

          const chat = await db.chat.findFirst({
            where: {
              id: chatId,
              userId: user.id,
            },
          });

          if (!chat) {
            throw new Error("Chat not found");
          }

          const updatedChat = await db.chat.update({
            where: {
              id: chatId,
            },
            data: {
              title: newTitle,
            },
          });

          return {
            success: true,
            chat: {
              id: updatedChat.id,
              title: updatedChat.title,
              threadId: updatedChat.threadId,
              updatedAt: updatedChat.updatedAt,
            },
          };
        },
        {
          body: t.Object({
            chatId: t.String(),
            newTitle: t.String(),
          }),
          response: t.Object({
            success: t.Boolean(),
            chat: t.Object({
              id: t.String(),
              title: t.String(),
              threadId: t.Optional(t.String()),
              updatedAt: t.String(),
            }),
          }),
          detail: {
            // tags: ["Chat"],
          },
        }
      )
  );

  return Promise.resolve(app);
};
