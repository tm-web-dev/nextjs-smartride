import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(50),

  email: z.email().trim().toLowerCase().max(150).regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please use a valid email address"),

  password: z.string().min(6).max(100).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{6,}$/, "Password must be at least 6 characters long and contain both letters and numbers"),
})
.strict();