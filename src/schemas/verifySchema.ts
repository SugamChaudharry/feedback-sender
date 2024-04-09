import {z} from 'zod';

export const verifySchema = z.object({
    token: z.string().length(6, "Token should be exactly 6 characters long")
})