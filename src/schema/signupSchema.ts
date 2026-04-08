import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(50),

  email: z.email().trim().toLowerCase().max(150).regex(/\S+@\S+\.\S+/, "Please use a valid email address"),

  password: z.string().min(6).max(100),
})
.strict();