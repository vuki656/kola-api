import { faker } from '@faker-js/faker'

import { OIB_LENGTH } from '../../../shared/constants'
import { ErrorCode } from '../../../shared/errors'
import {
    ListingFactory,
    UserFactory,
} from '../../../shared/test/factories'
import type {
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

// TODO: tests for other user shit
// TODO: change password
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
                query: USER,
                variables: {
                    args: {
                        id: user.id,
                    },
                },
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            // expect(response.body?.singleResult.data?.user).toMatchObject<UserPayloadFragment>({
            //     email: user.email,
            //     firstName: user.firstName,
            //     id: user.id,
            //     lastName: user.lastName,
            // })
        })

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
    })

    describe('when `deleteUser` mutation is called', () => {
        it('should delete the user', async () => {
            const user = await UserFactory.create()

            const response = await executeOperation<
                DeleteUserMutation,
                DeleteUserMutationVariables
            >({
                permission: 'isAdmin',
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
            const user = await UserFactory.create()

            const response = await executeOperation<
                DeleteUserMutation,
                DeleteUserMutationVariables
            >({
                query: DELETE_USER,
                variables: {
                    input: {
                        id: user.id,
                    },
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHENTICATION)
            expect(response.body?.singleResult.data).toBeNull()
        })

        it('should throw an AUTHORIZATION error if user not admin', async () => {
            const user = await UserFactory.create()

            const response = await executeOperation<
                DeleteUserMutation,
                DeleteUserMutationVariables
            >({
                permission: 'isLoggedIn',
                query: DELETE_USER,
                variables: {
                    input: {
                        id: user.id,
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
                        password: UserFactory.password.raw,
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
                query: USERS,
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.users).toHaveLength(COUNT)
        })
    })

    describe('when `currentUser` query is called', () => {
        it('should return currentUser', async () => {
            const user = UserFactory.build()

            const response = await executeOperation<
                CurrentUserQuery,
                CurrentUserQueryVariables
            >({
                permission: 'isLoggedIn',
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

        it('should throw an AUTHORIZATION error if not logged in', async () => {
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
            // expect(response.body?.singleResult.data?.createUser.user).toMatchObject<UserPayloadFragment>(user)
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
                permission: 'isLoggedIn',
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
                permission: 'isLoggedIn',
                query: UPDATE_USER,
                variables: {
                    input,
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHORIZATION)
            expect(response.body?.singleResult.data).toBeNull()
        })
        it('should throw an AUTHENTICATION error if not logged in', async () => {
            const input: UpdateUserInput = {
                email: faker.internet.email(),
                firstName: faker.name.firstName(),
                id: faker.datatype.uuid(),
                lastName: faker.name.lastName(),
                oib: faker.datatype.string(OIB_LENGTH),
                phoneNumber: faker.phone.number(),
            }

            const response = await executeOperation<
                UpdateUserMutation,
                UpdateUserMutationVariables
            >({
                query: UPDATE_USER,
                variables: {
                    input,
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHENTICATION)
            expect(response.body?.singleResult.data).toBeNull()
        })
    })
})
