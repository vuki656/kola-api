import { z } from 'zod'

const listingValidation = z.object({
    description: z.string(),
    id: z
        .string()
        .uuid(),
    price: z
        .number()
        .nonnegative(),
    title: z.string(),
})

export const tokenValidation = z.object({
    user: z
        .object({
            email: z.string().email(),
            firstName: z.string(),
            id: z.string().uuid(),
            isAdmin: z.boolean(),
            lastName: z.string(),
            listings: z.array(listingValidation),
        })
        .nullable(),
})
