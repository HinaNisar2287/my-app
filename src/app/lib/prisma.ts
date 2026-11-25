
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
// @ts-expect-error: ws is installed at runtime, but its declaration package is not available.
import ws from "ws";

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Read database connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing. Check your .env file."
  );
}

// Reuse Prisma Client during development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma Client with Neon adapter
function createPrismaClient() {
  const adapter = new PrismaNeon({
    connectionString,
  });

  return new PrismaClient({
    adapter,
  });
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
