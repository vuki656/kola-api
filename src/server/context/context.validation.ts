import { z } from 'zod'

export const cookieValidation = z.object({
    user: z
        .object({
            email: z.string().email(),
            firstName: z.string(),
            id: z.string().uuid(),
            lastName: z.string(),
        })
        .nullable(),
})
