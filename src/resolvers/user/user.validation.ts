import { z } from 'zod'

import { OIB_LENGTH } from '../../shared/constants'

const oibValidation = z
    .string()
    .length(OIB_LENGTH)

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

export const changeUserPasswordMutationValidation = z.object({
    input: z.object({
        currentPassword: z.string(),
        newPassword: z.string(),
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
