import type { Pet } from "@prisma/client";

export type PetEssentials = Omit<
  Pet,
  "id" | "createdAt" | "updatedAt" | "userId"
>;
