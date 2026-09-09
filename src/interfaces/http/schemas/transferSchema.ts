import { z } from "zod";

export const transferSchema = z.object({
    originAccountId: z
    .uuid(),

    destinyAccountId: z
    .uuid(),

    amount: z
    .int()
    .nonnegative()
    .min(1, "Amount can't be 0"),

    currency: z
    .enum(["ARS", "USD"]),

    description: z
    .string()
    .max(254)
    .nullable(),

    idempotencyKey: z
    .uuid(),
})