import { orm } from '../../shared/orm'

import type { UserModule } from './resolver-types.generated'
import {
    createUserMutationValidation,
    deleteUserMutationValidation,
    updateUserMutationValidation,
    userQueryValidation,
} from './user.validation'

const UserResolver: UserModule.Resolvers = {
    Mutation: {
        createUser: async (_, variables) => {
            const { input } = createUserMutationValidation.parse(variables)

            const user = await orm.user.create({
                data: {
                    email: input.email,
                    firstName: input.firstName,
                    lastName: input.lastName,
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
        updateUser: async (_, variables) => {
            const { input } = updateUserMutationValidation.parse(variables)

            const user = await orm.user.update({
                data: {
                    email: input.email,
                    firstName: input.firstName,
                    lastName: input.lastName,
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
