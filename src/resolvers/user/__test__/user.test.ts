import { faker } from '@faker-js/faker'

import { OIB_LENGTH } from '../../../shared/constants'
import { ErrorCode } from '../../../shared/errors'
import {
    ListingFactory,
    UserFactory,
} from '../../../shared/test/factories'
import type {
    ChangeUserPasswordMutation,
    ChangeUserPasswordMutationVariables,
    CreateUserInput,
    CreateUserMutation,
    CreateUserMutationVariables,
    CurrentUserQuery,
    CurrentUserQueryVariables,
    DeleteUserMutation,
    DeleteUserMutationVariables,
    LoginUserMutation,
    LoginUserMutationVariables,
    UpdateUserInput,
    UpdateUserMutation,
    UpdateUserMutationVariables,
    UserListingsQuery,
    UserListingsQueryVariables,
    UserPayloadFragment,
    UserQuery,
    UserQueryVariables,
    UsersQuery,
    UsersQueryVariables,
} from '../../../shared/test/types.generated'
import {
    executeOperation,
    wipeDatabase,
} from '../../../shared/test/utils'

import {
    CHANGE_USER_PASSWORD,
    CREATE_USER,
    DELETE_USER,
    LOGIN_USER,
    UPDATE_USER,
} from './mutations.graphql'
import {
    CURRENT_USER,
    USER,
    USER_LISTINGS,
    USERS,
} from './queries.graphql'

describe('User resolver', () => {
    beforeEach(async () => {
        await wipeDatabase()
    })

    describe('when `user` query is called', () => {
        it('should return user', async () => {
            const user = await UserFactory.create()

            const response = await executeOperation<
                UserQuery,
                UserQueryVariables
            >({
                permission: 'user',
                query: USER,
                variables: {
                    args: {
                        id: user.id,
                    },
                },
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.user).toMatchObject<UserPayloadFragment>({
                email: user.email,
                firstName: user.firstName,
                id: user.id,
                isAdmin: user.isAdmin,
                lastName: user.lastName,
                oib: user.oib,
                phoneNumber: user.phoneNumber,
            })
        })

        it('should AUTHENTICATION error if user not logged in', async () => {
            const response = await executeOperation<
                UserQuery,
                UserQueryVariables
            >({
                query: USER,
                variables: {
                    args: {
                        id: faker.datatype.uuid(),
                    },
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHENTICATION)
            expect(response.body?.singleResult.data).toBeNull()
        })
    })

    describe('when `user` `listings` field resolver is called', () => {
        it('should return users listings', async () => {
            const user = await UserFactory.create({
                listings: {
                    create: ListingFactory.build(),
                },
            })

            const response = await executeOperation<
                UserListingsQuery,
                UserListingsQueryVariables
            >({
                permission: 'user',
                query: USER_LISTINGS,
                variables: {
                    args: {
                        id: user.id,
                    },
                },
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.user.listings).toHaveLength(1)
        })

        it('should return AUTHENTICATION error if user not logged in', async () => {
            const response = await executeOperation<
                UserListingsQuery,
                UserListingsQueryVariables
            >({
                query: USER_LISTINGS,
                variables: {
                    args: {
                        id: faker.datatype.uuid(),
                    },
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHENTICATION)
            expect(response.body?.singleResult.data).toBeNull()
        })
    })

    describe('when `deleteUser` mutation is called', () => {
        it('should delete the user', async () => {
            const user = await UserFactory.create()

            const response = await executeOperation<
                DeleteUserMutation,
                DeleteUserMutationVariables
            >({
                permission: 'admin',
                query: DELETE_USER,
                variables: {
                    input: {
                        id: user.id,
                    },
                },
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.deleteUser.user).toMatchObject<UserPayloadFragment>({
                email: user.email,
                firstName: user.firstName,
                id: user.id,
                isAdmin: user.isAdmin,
                lastName: user.lastName,
                oib: user.oib,
                phoneNumber: user.phoneNumber,
            })
        })

        it('should throw an AUTHENTICATION error if user not logged in', async () => {
            const response = await executeOperation<
                DeleteUserMutation,
                DeleteUserMutationVariables
            >({
                query: DELETE_USER,
                variables: {
                    input: {
                        id: faker.datatype.uuid(),
                    },
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHENTICATION)
            expect(response.body?.singleResult.data).toBeNull()
        })

        it('should throw an AUTHORIZATION error if user not admin', async () => {
            const response = await executeOperation<
                DeleteUserMutation,
                DeleteUserMutationVariables
            >({
                permission: 'user',
                query: DELETE_USER,
                variables: {
                    input: {
                        id: faker.datatype.uuid(),
                    },
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHORIZATION)
            expect(response.body?.singleResult.data).toBeNull()
        })
    })

    describe('when `loginUser` mutation is called', () => {
        it('should return user and token', async () => {
            const user = await UserFactory.create()

            const response = await executeOperation<
                LoginUserMutation,
                LoginUserMutationVariables
            >({
                query: LOGIN_USER,
                variables: {
                    input: {
                        email: user.email,
                        password: UserFactory.password.raw,
                    },
                },
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.loginUser.token).toStrictEqual(expect.any(String))
            expect(response.body?.singleResult.data?.loginUser.user).toMatchObject<UserPayloadFragment>({
                email: user.email,
                firstName: user.firstName,
                id: user.id,
                isAdmin: user.isAdmin,
                lastName: user.lastName,
                oib: user.oib,
                phoneNumber: user.phoneNumber,
            })
        })
        it('should return INPUT error if wrong email', async () => {
            const response = await executeOperation<
                LoginUserMutation,
                LoginUserMutationVariables
            >({
                query: LOGIN_USER,
                variables: {
                    input: {
                        email: faker.internet.email(),
                        password: faker.internet.password(),
                    },
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.INPUT)
            expect(response.body?.singleResult.data).toBeNull()
        })
        it('should return INPUT error if wrong password', async () => {
            const user = await UserFactory.create()

            const response = await executeOperation<
                LoginUserMutation,
                LoginUserMutationVariables
            >({
                query: LOGIN_USER,
                variables: {
                    input: {
                        email: user.email,
                        password: faker.internet.password(),
                    },
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.INPUT)
            expect(response.body?.singleResult.data).toBeNull()
        })
    })

    describe('when `users` query is called', () => {
        it('should return users', async () => {
            const COUNT = 20

            await UserFactory.createMany(20)

            const response = await executeOperation<
                UsersQuery,
                UsersQueryVariables
            >({
                permission: 'admin',
                query: USERS,
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.users).toHaveLength(COUNT + 1) // + 1 for the auto-created authorized user
        })

        it('should throw an AUTHENTICATION error if user not logged in', async () => {
            const response = await executeOperation<
                UsersQuery,
                UsersQueryVariables
            >({
                query: USERS,
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHENTICATION)
            expect(response.body?.singleResult.data).toBeNull()
        })

        it('should throw an AUTHORIZATION error if user not admin', async () => {
            const response = await executeOperation<
                UsersQuery,
                UsersQueryVariables
            >({
                permission: 'user',
                query: USERS,
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHORIZATION)
            expect(response.body?.singleResult.data).toBeNull()
        })
    })

    describe('when `currentUser` query is called', () => {
        it('should return currentUser', async () => {
            const user = UserFactory.build()

            const response = await executeOperation<
                CurrentUserQuery,
                CurrentUserQueryVariables
            >({
                permission: 'user',
                query: CURRENT_USER,
                user,
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.currentUser).toMatchObject<UserPayloadFragment>({
                email: user.email,
                firstName: user.firstName,
                id: expect.any(String),
                isAdmin: user.isAdmin,
                lastName: user.lastName,
                oib: user.oib,
                phoneNumber: user.phoneNumber,
            })
        })

        it('should throw an AUTHORIZATION error if user not logged in', async () => {
            const response = await executeOperation<
                CurrentUserQuery,
                CurrentUserQueryVariables
            >({
                query: CURRENT_USER,
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHENTICATION)
            expect(response.body?.singleResult.data?.currentUser).toBeNull()
        })
    })

    describe('when `createUser` mutation is called', () => {
        it('should create user', async () => {
            const input: CreateUserInput = {
                email: faker.internet.email(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                oib: faker.datatype.string(OIB_LENGTH),
                password: faker.internet.password(),
                phoneNumber: faker.phone.number(),
            }

            const response = await executeOperation<
                CreateUserMutation,
                CreateUserMutationVariables
            >({
                query: CREATE_USER,
                variables: {
                    input,
                },
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.createUser.user).toMatchObject<UserPayloadFragment>({
                email: input.email,
                firstName: input.firstName,
                id: expect.any(String),
                isAdmin: false,
                lastName: input.lastName,
                oib: input.oib,
                phoneNumber: input.phoneNumber,
            })
        })
    })

    describe('when `updateUser` mutation is called', () => {
        it('should update user', async () => {
            const user = await UserFactory.create()

            const input: UpdateUserInput = {
                email: faker.internet.email(),
                firstName: faker.name.firstName(),
                id: user.id,
                lastName: faker.name.lastName(),
                oib: faker.datatype.string(OIB_LENGTH),
                phoneNumber: faker.phone.number(),
            }

            const response = await executeOperation<
                UpdateUserMutation,
                UpdateUserMutationVariables
            >({
                permission: 'user',
                query: UPDATE_USER,
                user: {
                    id: user.id,
                },
                variables: {
                    input,
                },
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.updateUser.user).toMatchObject<UserPayloadFragment>({
                ...input,
                isAdmin: false,
            })
        })

        it('should throw an AUTHORIZATION error if updating user that isn\'t himself', async () => {
            const user = await UserFactory.create()

            const input: UpdateUserInput = {
                email: faker.internet.email(),
                firstName: faker.name.firstName(),
                id: user.id,
                lastName: faker.name.lastName(),
                oib: faker.datatype.string(OIB_LENGTH),
                phoneNumber: faker.phone.number(),
            }

            const response = await executeOperation<
                UpdateUserMutation,
                UpdateUserMutationVariables
            >({
                permission: 'user',
                query: UPDATE_USER,
                variables: {
                    input,
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHORIZATION)
            expect(response.body?.singleResult.data).toBeNull()
        })

        it('should throw an AUTHENTICATION error if user not logged in', async () => {
            const response = await executeOperation<
                UpdateUserMutation,
                UpdateUserMutationVariables
            >({
                query: UPDATE_USER,
                variables: {
                    input: {
                        email: faker.internet.email(),
                        firstName: faker.name.firstName(),
                        id: faker.datatype.uuid(),
                        lastName: faker.name.lastName(),
                        oib: faker.datatype.string(OIB_LENGTH),
                        phoneNumber: faker.phone.number(),
                    },
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHENTICATION)
            expect(response.body?.singleResult.data).toBeNull()
        })
    })

    describe('when `changeUserPassword` mutation is called', () => {
        it('should change user password', async () => {
            const NEW_PASSWORD = faker.lorem.word()

            const user = await UserFactory.create()

            const changePasswordResponse = await executeOperation<
                ChangeUserPasswordMutation,
                ChangeUserPasswordMutationVariables
            >({
                permission: 'user',
                query: CHANGE_USER_PASSWORD,
                user: {
                    id: user.id,
                },
                variables: {
                    input: {
                        currentPassword: UserFactory.password.raw,
                        newPassword: NEW_PASSWORD,
                    },
                },
            })

            const loginResponse = await executeOperation<
                LoginUserMutation,
                LoginUserMutationVariables
            >({
                query: LOGIN_USER,
                variables: {
                    input: {
                        email: user.email,
                        password: NEW_PASSWORD,
                    },
                },
            })

            expect(changePasswordResponse.body?.singleResult.errors).toBeUndefined()
            expect(changePasswordResponse.body?.singleResult.data?.changeUserPassword.success).toBe(true)

            expect(loginResponse.body?.singleResult.errors).toBeUndefined()
            expect(loginResponse.body?.singleResult.data?.loginUser.token).toStrictEqual(expect.any(String))
            expect(loginResponse.body?.singleResult.data?.loginUser.user).toMatchObject<UserPayloadFragment>({
                email: user.email,
                firstName: user.firstName,
                id: user.id,
                isAdmin: user.isAdmin,
                lastName: user.lastName,
                oib: user.oib,
                phoneNumber: user.phoneNumber,
            })
        })

        it('should throw an INPUT error if wrong password is provided', async () => {
            const user = await UserFactory.create()

            const response = await executeOperation<
                ChangeUserPasswordMutation,
                ChangeUserPasswordMutationVariables
            >({
                permission: 'user',
                query: CHANGE_USER_PASSWORD,
                user: {
                    id: user.id,
                },
                variables: {
                    input: {
                        currentPassword: faker.lorem.word(),
                        newPassword: faker.lorem.word(),
                    },
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.INPUT)
            expect(response.body?.singleResult.data).toBeNull()
        })
    })
})
