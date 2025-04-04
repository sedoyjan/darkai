import { PrismaClient } from "../prisma/prisma-client-js";

// Extend the NodeJS global object to include the PrismaClient instance
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Check if there is already a PrismaClient instance in the global scope
export const prisma =
  global.prisma ||
  new PrismaClient({
    // Optional: Log all queries, errors, and information in development mode for debugging purposes
    // log:
    //   process.env.NODE_ENV === "development"
    //     ? ["query", "info", "warn", "error"]
    //     : [],
  });

export const db = prisma;

// In development mode, store the Prisma client in the global object to prevent multiple instances during hot-reloading
if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}
