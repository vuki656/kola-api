import { z } from 'zod'

// TODO: remove limits
export const createUserMutationValidation = z.object({
    input: z.object({
        email: z
            .string()
            .email(),
        firstName: z
            .string()
            .min(3)
            .max(255),
        lastName: z
            .string()
            .min(3)
            .max(255),
    }),
})

export const updateUserMutationValidation = z.object({
    input: z.object({
        email: z
            .string()
            .email(),
        firstName: z
            .string()
            .min(3)
            .max(255),
        id: z
            .string()
            .uuid(),
        lastName: z
            .string()
            .min(3)
            .max(255),
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
