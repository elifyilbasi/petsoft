import "dotenv/config";

import { defineConfig } from "prisma/config";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.POSTGRES_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx ./prisma/seed.ts",
  },
  datasource: {
    url:
      DATABASE_URL ??
      (() => {
        // Keep the error actionable for CI/Vercel.
        throw new Error(
          "Missing database env var: set DATABASE_URL (or POSTGRES_PRISMA_URL / POSTGRES_URL on Vercel).",
        );
      })(),
  },
});
