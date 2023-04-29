import { z } from 'zod'

const oibValidation = z
    .number()
    .min(11)
    .max(11)

export const createUserMutationValidation = z.object({
    input: z.object({
        email: z
            .string()
            .email(),
        firstName: z.string(),
        lastName: z.string(),
        oib: oibValidation,
        password: z.string(),
        phoneNumber: z.string(),
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
        lastName: z.string(),
        oib: oibValidation,
        phoneNumber: z.string(),
    }),
})

export const deleteUserMutationValidation = z.object({
    input: z.object({
        id: z
            .string()
            .uuid(),
    }),
})

export const loginUserMutationValidation = z.object({
    input: z.object({
        email: z
            .string()
            .email(),
        password: z.string(),
    }),
})

export const userQueryValidation = z.object({
    args: z.object({
        id: z
            .string()
            .uuid(),
    }),
})
