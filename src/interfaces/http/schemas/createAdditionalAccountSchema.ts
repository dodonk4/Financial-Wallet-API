import { z } from "zod";

export const createAdditionalAccountSchema = z.object({
    currency: z
    .enum(["ARS", "USD"]),
});