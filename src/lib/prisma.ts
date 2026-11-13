import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { cache } from "react";

/** One Prisma client per request, connected to the Cloudflare D1 binding. */
export const getPrisma = cache(() => {
  const { env } = getCloudflareContext();
  return new PrismaClient({ adapter: new PrismaD1(env.DB) });
});
