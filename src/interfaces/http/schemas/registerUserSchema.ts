import { z } from "zod";

export const registerUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(72),

  document: z.object({
    type: z
      .string()
      .trim()
      .min(1, "Document type is required")
      .max(50),
    number: z
      .int()
      .min(1, "Document number is required")
  }),
});