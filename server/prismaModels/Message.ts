import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MessagePlain = t.Object(
  {
    id: t.String(),
    userId: t.String(),
    text: t.String(),
    createdAt: t.Date(),
    type: t.Union([t.Literal("SYSTEM"), t.Literal("USER"), t.Literal("BOT")], {
      additionalProperties: false,
    }),
    chatId: __nullable__(t.String()),
  },
  { additionalProperties: false },
);

export const MessageRelations = t.Object(
  {
    user: t.Object(
      {
        id: t.String(),
        email: __nullable__(t.String()),
        displayName: t.String(),
        fcmToken: t.Array(t.String(), { additionalProperties: false }),
        locale: t.String(),
        identityToken: t.String(),
        appUserId: __nullable__(t.String()),
        expirationAtMs: t.Integer(),
        createdAt: t.Date(),
        requestsCount: t.Integer(),
      },
      { additionalProperties: false },
    ),
    chat: __nullable__(
      t.Object(
        {
          id: t.String(),
          userId: t.String(),
          title: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          threadId: __nullable__(t.String()),
          lastFollowUpSentAt: __nullable__(t.Date()),
          followUpCount: t.Integer(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const MessagePlainInputCreate = t.Object(
  {
    text: t.String(),
    type: t.Union([t.Literal("SYSTEM"), t.Literal("USER"), t.Literal("BOT")], {
      additionalProperties: false,
    }),
  },
  { additionalProperties: false },
);

export const MessagePlainInputUpdate = t.Object(
  {
    text: t.Optional(t.String()),
    type: t.Optional(
      t.Union([t.Literal("SYSTEM"), t.Literal("USER"), t.Literal("BOT")], {
        additionalProperties: false,
      }),
    ),
  },
  { additionalProperties: false },
);

export const MessageRelationsInputCreate = t.Object(
  {
    user: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
    chat: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const MessageRelationsInputUpdate = t.Partial(
  t.Object(
    {
      user: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      chat: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const MessageWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          userId: t.String(),
          text: t.String(),
          createdAt: t.Date(),
          type: t.Union(
            [t.Literal("SYSTEM"), t.Literal("USER"), t.Literal("BOT")],
            { additionalProperties: false },
          ),
          chatId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "Message" },
  ),
);

export const MessageWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.String() })], {
          additionalProperties: false,
        }),
        t.Partial(
          t.Object({
            AND: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            NOT: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            OR: t.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object(
            {
              id: t.String(),
              userId: t.String(),
              text: t.String(),
              createdAt: t.Date(),
              type: t.Union(
                [t.Literal("SYSTEM"), t.Literal("USER"), t.Literal("BOT")],
                { additionalProperties: false },
              ),
              chatId: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Message" },
);

export const MessageSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      userId: t.Boolean(),
      text: t.Boolean(),
      createdAt: t.Boolean(),
      user: t.Boolean(),
      type: t.Boolean(),
      chat: t.Boolean(),
      chatId: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MessageInclude = t.Partial(
  t.Object(
    {
      user: t.Boolean(),
      type: t.Boolean(),
      chat: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MessageOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      text: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      chatId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Message = t.Composite([MessagePlain, MessageRelations], {
  additionalProperties: false,
});

export const MessageInputCreate = t.Composite(
  [MessagePlainInputCreate, MessageRelationsInputCreate],
  { additionalProperties: false },
);

export const MessageInputUpdate = t.Composite(
  [MessagePlainInputUpdate, MessageRelationsInputUpdate],
  { additionalProperties: false },
);
