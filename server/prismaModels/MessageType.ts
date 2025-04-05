import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MessageType = t.Union(
  [t.Literal("SYSTEM"), t.Literal("USER"), t.Literal("BOT")],
  { additionalProperties: false },
);
