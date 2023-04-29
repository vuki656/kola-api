import {
    compare,
    hash,
} from 'bcrypt'
import { sign } from 'jsonwebtoken'

import { env } from '../../shared/env'
import { InputError } from '../../shared/errors'
import { orm } from '../../shared/orm'
import type { TokenDataType } from '../../shared/types'

import type { UserModule } from './resolver-types.generated'
import {
    createUserMutationValidation,
    deleteUserMutationValidation,
    loginUserMutationValidation,
    updateUserMutationValidation,
    userQueryValidation,
} from './user.validation'

const UserResolver: UserModule.Resolvers = {
    Mutation: {
        createUser: async (_, variables) => {
            const { input } = createUserMutationValidation.parse(variables)

            const passwordHash = await hash(input.password, 10)

            const user = await orm.user.create({
                data: {
                    email: input.email,
                    firstName: input.firstName,
                    lastName: input.lastName,
                    oib: input.oib,
                    password: passwordHash,
                    phoneNumber: input.phoneNumber,
                    updatedAt: new Date(),
                },
            })

            return {
                user,
            }
        },
        deleteUser: async (_, variables) => {
            const { input } = deleteUserMutationValidation.parse(variables)

            const user = await orm.user.delete({
                where: {
                    id: input.id,
                },
            })

            return {
                user,
            }
        },
        loginUser: async (_, variables) => {
            const { input } = loginUserMutationValidation.parse(variables)

            const user = await orm.user.findUnique({
                include: {
                    listings: true,
                },
                where: {
                    email: input.email,
                },
            })

            if (!user) {
                throw new InputError('Wrong username or password')
            }

            const isPasswordValid = await compare(input.password, user.password)

            if (!isPasswordValid) {
                throw new InputError('Wrong username or password')
            }

            const tokenData: TokenDataType = {
                user,
            }

            const token = sign(
                tokenData,
                env.APP_JWT_SECRET,
                { expiresIn: env.APP_JWT_DURATION_SEC }
            )

            return {
                token,
                user,
            }
        },
        logoutUser: (_, __, context) => {
            context.user.clear()

            return {
                success: true,
            }
        },
        updateUser: async (_, variables) => {
            const { input } = updateUserMutationValidation.parse(variables)

            const user = await orm.user.update({
                data: {
                    email: input.email,
                    firstName: input.firstName,
                    lastName: input.lastName,
                    oib: input.oib,
                    phoneNumber: input.phoneNumber,
                    updatedAt: new Date(),
                },
                where: {
                    id: input.id,
                },
            })

            return {
                user,
            }
        },
    },
    Query: {
        currentUser: (_, __, context) => {
            return orm.user.findUnique({
                where: {
                    id: context.user.nonNullValue.id,
                },
            })
        },
        user: (_, variables) => {
            const { args } = userQueryValidation.parse(variables)

            return orm.user.findUniqueOrThrow({
                where: {
                    id: args.id,
                },
            })
        },
        users: async () => {
            return orm.user.findMany()
        },
    },
    User: {
        listings: async (parent) => {
            return orm.listing.findMany({
                where: {
                    author: {
                        id: parent.id,
                    },
                },
            })
        },
    },
}

export default UserResolver
