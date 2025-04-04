import { Context } from "elysia";
import { db } from "../db";
import bearer from "@elysiajs/bearer";
import { validate } from "../services/firebase";
import { Elysia as ElysiaApp } from "elysia";

const unauthorizedResponse = (set: Context["set"]) => {
  set.status = 401;
  return {
    success: false,
    message: "Unauthorized",
    data: null,
    user: {
      id: "",
    },
  };
};

const getUserFromToken = async (
  token: string,
  set: Context["set"],
  userIds: Record<string, string>
) => {
  const decoded = await validate(token).catch((error) => {
    console.error("🚀 ~ getUserFromToken ~ error", error, token);
    return null;
  });

  if (!decoded) {
    return unauthorizedResponse(set);
  }

  if (userIds[decoded.uid]) {
    return {
      user: {
        id: userIds[decoded.uid],
      },
    };
  }

  const user = await db.user.findUnique({
    where: {
      id: decoded.uid,
    },
  });

  if (!user) {
    return unauthorizedResponse(set);
  }

  userIds[decoded.uid] = user.id;

  return {
    user: {
      id: user.id,
    },
  };
};

export const isAuthenticated = (app: ElysiaApp) =>
  app.use(bearer()).derive(async ({ bearer, set, store }) => {
    if (!bearer) {
      return unauthorizedResponse(set);
    }
    // @ts-ignore
    const response = await getUserFromToken(bearer, set, store.userIds);
    return response;
  });
