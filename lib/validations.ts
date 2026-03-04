import z from "zod";

export const petIdSchema = z.cuid();

export const petFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100),
  ownerName: z
    .string()
    .trim()
    .min(1, { message: "Owner Name is required" })
    .max(100),
  imageUrl: z.union([z.literal(""), z.url({ message: "Invalid URL" })]),
  age: z.number().int().positive().max(999),
  notes: z.union([z.literal(""), z.string().trim().max(1000)]),
});

export type TPetForm = z.infer<typeof petFormSchema>;
