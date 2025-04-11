import Elysia, { t } from "elysia";
import { Message, MessageType } from "../../prisma/prisma-client-js";
import { MessagePlain } from "../../prismaModels/Message";
import { getAiResponse } from "../ai";
import { db } from "../db";
import { isAuthenticated } from "../middlewares/auth";

const formatDate = (date: Date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export const ChatController = (app: Elysia) => {
  app.group("/chat", (app) =>
    app
      .use(isAuthenticated)
      .onBeforeHandle(async ({ user, set }) => {
        const userData = await db.user.findUnique({
          where: { id: user.id },
        });

        if (!userData) {
          set.status = 404;
          return { error: "User not found" };
        }
      })
      .post(
        "/sendMessage",
        async ({ body, user }) => {
          const { chatId, text, locale } = body;

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

          console.log("prevThreadId", prevThreadId);

          const STATEGY_ASSISTANT_ID = process.env
            .OPENAI_API_STRATEGY_ASSISTANT_ID as string;

          const { data: responseMessageText, threadId } = await getAiResponse(
            STATEGY_ASSISTANT_ID,
            body.text + `-- reply with ${locale} language and use emojis`,
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
        }
      )
      .get(
        "/getMessages",
        async ({ user, query }) => {
          const { chatId, page = 1, limit = 10 } = query;
          const skip = (page - 1) * limit;

          const chat = await db.chat.findFirst({
            where: {
              id: chatId,
              userId: user.id,
            },
          });

          if (!chat) {
            throw new Error("Chat not found");
          }

          const totalMessages = await db.message.count({
            where: {
              chatId,
              userId: user.id,
            },
          });

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
        }
      )
      .get(
        "/getChats",
        async ({ user }) => {
          const chats = await db.chat.findMany({
            where: {
              userId: user.id,
            },
            include: {
              messages: {
                orderBy: {
                  createdAt: "desc",
                },
                take: 1,
              },
            },
            orderBy: {
              updatedAt: "desc",
            },
          });

          return chats.map((ch) => {
            return {
              id: ch.id,
              title: ch.title,
              threadId: ch.threadId,
              updatedAt: ch.updatedAt.toISOString(),
              messages: ch.messages,
            };
          });
        },
        {
          response: t.Array(
            t.Object({
              id: t.String(),
              title: t.String(),
              threadId: t.Nullable(t.Optional(t.String())),
              updatedAt: t.String(),
              messages: t.Array(MessagePlain),
            })
          ),
        }
      )

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
                take: 1,
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
            updatedAt: chat.updatedAt.toISOString(),
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
            threadId: t.Nullable(t.Optional(t.String())),
            updatedAt: t.String(),
            lastMessage: t.Optional(MessagePlain),
          }),
        }
      )
      .delete(
        "deleteAllChats",
        async ({ user }) => {
          await db.chat.deleteMany({
            where: {
              userId: user.id,
            },
          });

          return { success: true };
        },
        {
          response: t.Object({
            success: t.Boolean(),
          }),
        }
      )
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
            id: updatedChat.id,
            title: updatedChat.title,
            threadId: updatedChat.threadId,
            updatedAt: updatedChat.updatedAt.toISOString(),
          };
        },
        {
          body: t.Object({
            chatId: t.String(),
            newTitle: t.String(),
          }),
          response: t.Object({
            id: t.String(),
            title: t.String(),
            threadId: t.Nullable(t.Optional(t.String())),
            updatedAt: t.String(),
          }),
        }
      )
  );

  return Promise.resolve(app);
};
