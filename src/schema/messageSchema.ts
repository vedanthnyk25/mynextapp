import {z} from 'zod'

export const messageSchema = z.object({
    content: z.string()
              .min(7, "Message must be at least 7 character long")
                .max(300, "Message must be at most 250 characters long"),

    createdAt: z.date()
            
}) 