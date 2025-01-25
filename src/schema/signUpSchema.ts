import {z} from 'zod';

const validateUsername = z.string()
                          .min(3, "Username must be at least 3 characters long")
                          .max(20, "Username must be at most 20 characters long")
                          .regex(/^[a-zA-Z0-9_]+$/, "Username must contain only letters, numbers, and underscores")

export const signUpSchema = z.object({
    userName: validateUsername,
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})                          