import { z } from "zod";

export const verifySchema = z.object({
    code: z
      .string()
      .min(4, "Code must be at least 4 characters")
      .max(8, "Code is too long"),
  })