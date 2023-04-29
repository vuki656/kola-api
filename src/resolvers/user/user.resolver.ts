import {
    compare,
    hash,
} from 'bcrypt'
import { sign } from 'jsonwebtoken'

import { env } from '../../shared/env'
import { InputError } from '../../shared/errors'
import { orm } from '../../shared/orm'
import type { TokenDataType } from '../../shared/types'
import { checkPermissions } from '../../shared/utils'

import type { UserModule } from './resolver-types.generated'
import { UserUtils } from './user.utils'
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
        deleteUser: async (_, variables, context) => {
            checkPermissions(context, ['isLoggedIn', 'isAdmin'])

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
                user: {
                    ...user,
                    listings: user.listings.map((listing) => {
                        return {
                            ...listing,
                            price: listing.price.toNumber(),
                        }
                    }),
                },
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
            checkPermissions(context, ['isLoggedIn'])

            context.user.clear()

            return {
                success: true,
            }
        },
        updateUser: async (_, variables, context) => {
            checkPermissions(context, ['isLoggedIn'])

            const { input } = updateUserMutationValidation.parse(variables)

            UserUtils.checkIsPerformingOnSelf(context, input.id)

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
            checkPermissions(context, ['isLoggedIn'])

            return orm.user.findUniqueOrThrow({
                where: {
                    id: context.user.nonNullValue.id,
                },
            })
        },
        user: (_, variables, context) => {
            checkPermissions(context, ['isLoggedIn'])

            const { args } = userQueryValidation.parse(variables)

            return orm.user.findUniqueOrThrow({
                where: {
                    id: args.id,
                },
            })
        },
        users: async (_, __, context) => {
            checkPermissions(context, ['isLoggedIn', 'isAdmin'])

            return orm.user.findMany()
        },
    },
    User: {
        listings: async (parent, _, context) => {
            checkPermissions(context, ['isLoggedIn'])

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
