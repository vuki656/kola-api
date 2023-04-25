import { z } from 'zod'

export const createListingMutationValidation = z.object({
    input: z.object({
        authorId: z
            .string()
            .uuid(),
        description: z.string(),
        price: z
            .number()
            .nonnegative(),
        title: z.string(),
    }),
})

export const updateListingMutationValidation = z.object({
    input: z.object({
        description: z.string(),
        id: z
            .string()
            .uuid(),
        price: z
            .number()
            .nonnegative(),
        title: z.string(),
    }),
})

export const deleteListingMutationValidation = z.object({
    input: z.object({
        id: z
            .string()
            .uuid(),
    }),
})

export const listingQueryValidation = z.object({
    args: z.object({
        id: z
            .string()
            .uuid(),
    }),
})
