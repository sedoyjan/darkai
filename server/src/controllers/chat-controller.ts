import Elysia, { t } from "elysia";
import { Message, MessageType } from "../../prisma/prisma-client-js";
import { MessagePlain } from "../../prismaModels/Message";
import { isAuthenticated } from "../middlewares/auth";
import { db } from "../db";
import { generateDarkAIStrategy } from "../ai";

const formatDate = (date: Date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export const ChatController = (app: Elysia) => {
  app.group("/chat", (app) =>
    app
      .use(isAuthenticated)
      .post(
        "/sendMessage",
        async ({ body, user }) => {
          console.log("User ID:", user.id);
          await db.message.create({
            data: {
              text: body.text,
              imageUrl: body.imageUrl,
              imageHash: body.imageHash,
              type: MessageType.USER,
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          });
          console.log("User message:", body.text);
          const aiResponse = await generateDarkAIStrategy(body.text);

          console.log("AI response:", aiResponse.data);

          const [responseMessage] = await Promise.all([
            db.message.create({
              data: {
                text: aiResponse.data,
                imageUrl: undefined,
                type: MessageType.BOT,
                user: {
                  connect: {
                    id: user.id,
                  },
                },
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
          };
        },
        {
          body: t.Object({
            text: t.String(),
            imageUrl: t.Optional(t.String()),
            imageHash: t.Optional(t.String()),
            type: t.String(),
            locale: t.String(),
          }),
          response: t.Object({
            message: MessagePlain,
          }),
          detail: {
            // tags: ["Chat"],
          },
        }
      )
      .get(
        "/getMessages",
        async ({ user, query }) => {
          console.time("Get messages");
          const page = query.page || 1; // Default to page 1
          const limit = query.limit || 10; // Default to 10 messages per page
          const skip = (page - 1) * limit;

          const totalMessages = 100;
          const messages = await db.message.findMany({
            where: {
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
                imageUrl: null,
                type: MessageType.SYSTEM,
                createdAt: lastDate,
                imageHash: null,
                summaryId: null,
                userId: user.id,
              });
            }
            lastDate = message.createdAt;
            messagesWithSystem.push(message);
          });

          console.timeEnd("Get messages");

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
  );

  return Promise.resolve(app);
};
