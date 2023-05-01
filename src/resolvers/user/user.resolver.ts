import {
    compare,
    hash,
} from 'bcrypt'

import { InputError } from '../../shared/errors'
import { orm } from '../../shared/orm'
import { checkPermissions } from '../../shared/utils'

import type { UserModule } from './resolver-types.generated'
import { UserUtils } from './user.utils'
import {
    changeUserPasswordMutationValidation,
    createUserMutationValidation,
    deleteUserMutationValidation,
    loginUserMutationValidation,
    updateUserMutationValidation,
    userQueryValidation,
} from './user.validation'

const UserResolver: UserModule.Resolvers = {
    Mutation: {
        changeUserPassword: async (_, variables, context) => {
            const { input } = changeUserPasswordMutationValidation.parse(variables)

            const user = await orm.user.findUniqueOrThrow({
                where: {
                    id: context.user.nonNullValue.id,
                },
            })

            const isPasswordValid = await compare(input.currentPassword, user.password)

            if (!isPasswordValid) {
                throw new InputError('Wrong password')
            }

            const newPasswordHash = await hash(input.newPassword, 10)

            await orm.user.update({
                data: {
                    password: newPasswordHash,
                },
                where: {
                    id: context.user.nonNullValue.id,
                },
            })

            return {
                success: true,
            }
        },
        createUser: async (_, variables) => {
            const { input } = createUserMutationValidation.parse(variables)

            const userWithEmail = await orm.user.findUnique({
                where: {
                    email: input.email,
                },
            })

            if (userWithEmail) {
                throw new InputError('Email already in use')
            }

            const userWithOib = await orm.user.findUnique({
                where: {
                    oib: input.oib,
                },
            })

            if (userWithOib) {
                throw new InputError('OIB already in use')
            }

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
                include: {
                    listings: true,
                },
            })

            const token = UserUtils.signToken({
                user: {
                    ...user,
                    listings: user.listings.map((listing) => {
                        return {
                            ...listing,
                            price: listing.price.toNumber(),
                        }
                    }),
                },
            })

            return {
                token,
                user,
            }
        },
        deleteUser: async (_, variables, context) => {
            checkPermissions(context, ['user', 'admin'])

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

            const token = UserUtils.signToken({
                user: {
                    ...user,
                    listings: user.listings.map((listing) => {
                        return {
                            ...listing,
                            price: listing.price.toNumber(),
                        }
                    }),
                },
            })

            return {
                token,
                user,
            }
        },
        updateUser: async (_, variables, context) => {
            checkPermissions(context, ['user'])

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
            checkPermissions(context, ['user'])

            return orm.user.findUniqueOrThrow({
                where: {
                    id: context.user.nonNullValue.id,
                },
            })
        },
        user: (_, variables, context) => {
            checkPermissions(context, ['user'])

            const { args } = userQueryValidation.parse(variables)

            return orm.user.findUniqueOrThrow({
                where: {
                    id: args.id,
                },
            })
        },
        users: async (_, __, context) => {
            checkPermissions(context, ['user', 'admin'])

            return orm.user.findMany()
        },
    },
    User: {
        listings: async (parent, _, context) => {
            checkPermissions(context, ['user'])

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
