import { z } from "zod";

export const usernameVerificationSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username must be at most 20 characters long")
        .regex(/^[a-z0-9_]+$/, "Username must only contain lowercase alphanumeric characters and underscores")
        .transform((val) => val.toLowerCase()),
});