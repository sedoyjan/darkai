import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UserPlain = t.Object(
  {
    id: t.String(),
    email: __nullable__(t.String()),
    displayName: t.String(),
    fcmToken: t.Array(t.String(), { additionalProperties: false }),
    locale: t.String(),
    identityToken: t.String(),
    appUserId: t.String(),
    expirationAtMs: t.Integer(),
    createdAt: t.Date(),
    requestsCount: t.Integer(),
  },
  { additionalProperties: false },
);

export const UserRelations = t.Object(
  {
    Message: t.Array(
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
          chatId: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    Chat: t.Array(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const UserPlainInputCreate = t.Object(
  {
    email: t.Optional(__nullable__(t.String())),
    displayName: t.String(),
    fcmToken: t.Array(t.String(), { additionalProperties: false }),
    locale: t.String(),
    identityToken: t.String(),
    expirationAtMs: t.Optional(t.Integer()),
    requestsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const UserPlainInputUpdate = t.Object(
  {
    email: t.Optional(__nullable__(t.String())),
    displayName: t.Optional(t.String()),
    fcmToken: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    locale: t.Optional(t.String()),
    identityToken: t.Optional(t.String()),
    expirationAtMs: t.Optional(t.Integer()),
    requestsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const UserRelationsInputCreate = t.Object(
  {
    Message: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    Chat: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const UserRelationsInputUpdate = t.Partial(
  t.Object(
    {
      Message: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      Chat: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const UserWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          email: t.String(),
          displayName: t.String(),
          fcmToken: t.Array(t.String(), { additionalProperties: false }),
          locale: t.String(),
          identityToken: t.String(),
          appUserId: t.String(),
          expirationAtMs: t.Integer(),
          createdAt: t.Date(),
          requestsCount: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "User" },
  ),
);

export const UserWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), appUserId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ appUserId: t.String() })],
          { additionalProperties: false },
        ),
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
              email: t.String(),
              displayName: t.String(),
              fcmToken: t.Array(t.String(), { additionalProperties: false }),
              locale: t.String(),
              identityToken: t.String(),
              appUserId: t.String(),
              expirationAtMs: t.Integer(),
              createdAt: t.Date(),
              requestsCount: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "User" },
);

export const UserSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      email: t.Boolean(),
      displayName: t.Boolean(),
      fcmToken: t.Boolean(),
      locale: t.Boolean(),
      identityToken: t.Boolean(),
      appUserId: t.Boolean(),
      expirationAtMs: t.Boolean(),
      createdAt: t.Boolean(),
      requestsCount: t.Boolean(),
      Message: t.Boolean(),
      Chat: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UserInclude = t.Partial(
  t.Object(
    { Message: t.Boolean(), Chat: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const UserOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      displayName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fcmToken: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      locale: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      identityToken: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expirationAtMs: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requestsCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const User = t.Composite([UserPlain, UserRelations], {
  additionalProperties: false,
});

export const UserInputCreate = t.Composite(
  [UserPlainInputCreate, UserRelationsInputCreate],
  { additionalProperties: false },
);

export const UserInputUpdate = t.Composite(
  [UserPlainInputUpdate, UserRelationsInputUpdate],
  { additionalProperties: false },
);
