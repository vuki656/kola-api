import { z } from 'zod'

export const createUserMutationValidation = z.object({
    input: z.object({
        email: z
            .string()
            .email(),
        firstName: z.string(),
        lastName: z.string()
    }),
})

export const updateUserMutationValidation = z.object({
    input: z.object({
        email: z
            .string()
            .email(),
        firstName: z.string(),
        id: z
            .string()
            .uuid(),
        lastName: z.string()
    }),
})

export const deleteUserMutationValidation = z.object({
    input: z.object({
        id: z
            .string()
            .uuid(),
    }),
})

export const userQueryValidation = z.object({
    args: z.object({
        id: z
            .string()
            .uuid(),
    }),
})
