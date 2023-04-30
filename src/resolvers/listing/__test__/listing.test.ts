import { faker } from '@faker-js/faker'

import { ErrorCode } from '../../../shared/errors'
import {
    ListingFactory,
    UserFactory,
} from '../../../shared/test/factories'
import type {
    CreateListingMutation,
    CreateListingMutationVariables,
    DeleteListingMutation,
    DeleteListingMutationVariables,
    ListingAuthorQuery,
    ListingAuthorQueryVariables,
    ListingPayloadFragment,
    ListingQuery,
    ListingQueryVariables,
    ListingsQuery,
    ListingsQueryVariables,
    UpdateListingInput,
    UpdateListingMutation,
    UpdateListingMutationVariables,
} from '../../../shared/test/types.generated'
import {
    executeOperation,
    wipeDatabase,
} from '../../../shared/test/utils'
import type { CreateListingInput } from '../../graphql-types.generated'

import {
    CREATE_LISTING,
    DELETE_LISTING,
    UPDATE_LISTING,
} from './mutations.graphql'
import {
    LISTING,
    LISTING_AUTHOR,
    LISTINGS,
} from './queries.graphql'

describe('Listing resolver', () => {
    beforeEach(async () => {
        await wipeDatabase()
    })

    describe('when `listing` query is called', () => {
        it('should return listing', async () => {
            const listing = await ListingFactory.create()

            const response = await executeOperation<
                ListingQuery,
                ListingQueryVariables
            >({
                permission: 'user',
                query: LISTING,
                variables: {
                    args: {
                        id: listing.id,
                    },
                },
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.listing).toMatchObject<ListingPayloadFragment>({
                description: listing.description,
                id: listing.id,
                price: listing.price.toNumber(),
                title: listing.title,
            })
        })

        it('should return AUTHENTICATION error if user not logged in', async () => {
            const response = await executeOperation<
                ListingQuery,
                ListingQueryVariables
            >({
                query: LISTING,
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

    describe('when `listing` `author` field resolver is called', () => {
        it('should return listing author', async () => {
            const author = await UserFactory.create()
            const listing = await ListingFactory.create({
                author: {
                    connect: {
                        id: author.id,
                    },
                },
            })

            const response = await executeOperation<
                ListingAuthorQuery,
                ListingAuthorQueryVariables
            >({
                permission: 'user',
                query: LISTING_AUTHOR,
                user: {
                    id: author.id,
                },
                variables: {
                    args: {
                        id: listing.id,
                    },
                },
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.listing.author.id).toBe(author.id)
        })

        it('should return AUTHENTICATION error if user not logged in', async () => {
            const response = await executeOperation<
                ListingAuthorQuery,
                ListingAuthorQueryVariables
            >({
                query: LISTING_AUTHOR,
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

    describe('when `deleteListing` mutation is called', () => {
        it('should delete the listing', async () => {
            const author = await UserFactory.create()
            const listing = await ListingFactory.create({
                author: {
                    connect: {
                        id: author.id,
                    },
                },
            })

            const response = await executeOperation<
                DeleteListingMutation,
                DeleteListingMutationVariables
            >({
                permission: 'user',
                query: DELETE_LISTING,
                user: {
                    id: author.id,
                },
                variables: {
                    input: {
                        id: listing.id,
                    },
                },
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.deleteListing.listing).toMatchObject<ListingPayloadFragment>({
                description: listing.description,
                id: listing.id,
                price: listing.price.toNumber(),
                title: listing.title,
            })
        })

        it('should return AUTHORIZATION error if user doesn\'t own that listing', async () => {
            const response = await executeOperation<
                DeleteListingMutation,
                DeleteListingMutationVariables
            >({
                permission: 'user',
                query: DELETE_LISTING,
                variables: {
                    input: {
                        id: faker.datatype.uuid(),
                    },
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHORIZATION)
            expect(response.body?.singleResult.data).toBeNull()
        })

        it('should return AUTHENTICATION error if user not logged in', async () => {
            const response = await executeOperation<
                DeleteListingMutation,
                DeleteListingMutationVariables
            >({
                query: DELETE_LISTING,
                variables: {
                    input: {
                        id: faker.datatype.uuid(),
                    },
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHENTICATION)
            expect(response.body?.singleResult.data).toBeNull()
        })
    })

    describe('when `listings` query is called', () => {
        it('should return listings', async () => {
            const COUNT = 20

            const author = await UserFactory.create()
            await ListingFactory.createMany(20, {
                author: {
                    connect: {
                        id: author.id,
                    },
                },
            })

            const response = await executeOperation<
                ListingsQuery,
                ListingsQueryVariables
            >({
                permission: 'user',
                query: LISTINGS,
                user: {
                    id: author.id,
                },
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.listings).toHaveLength(COUNT)
        })

        it('should return AUTHENTICATION error if user not logged in', async () => {
            const response = await executeOperation<
                DeleteListingMutation,
                DeleteListingMutationVariables
            >({
                query: DELETE_LISTING,
                variables: {
                    input: {
                        id: faker.datatype.uuid(),
                    },
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHENTICATION)
            expect(response.body?.singleResult.data).toBeNull()
        })
    })

    describe('when `createListing` mutation is called', () => {
        it('should create listing', async () => {
            const author = await UserFactory.create()

            const input: CreateListingInput = {
                description: faker.lorem.sentence(),
                price: faker.datatype.number(),
                title: faker.lorem.words(),
            }

            const response = await executeOperation<
                CreateListingMutation,
                CreateListingMutationVariables
            >({
                permission: 'user',
                query: CREATE_LISTING,
                user: {
                    id: author.id,
                },
                variables: {
                    input,
                },
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.createListing.listing).toMatchObject<ListingPayloadFragment>({
                description: input.description,
                id: expect.any(String),
                price: input.price,
                title: input.title,
            })
        })

        it('should throw an AUTHORIZATION error if user not logged in', async () => {
            const response = await executeOperation<
                CreateListingMutation,
                CreateListingMutationVariables
            >({
                query: CREATE_LISTING,
                variables: {
                    input: {
                        description: faker.lorem.word(),
                        price: faker.datatype.number(),
                        title: faker.lorem.word(),
                    },
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHENTICATION)
            expect(response.body?.singleResult.data).toBeNull()
        })
    })

    describe('when `updateListing` mutation is called', () => {
        it('should update listing', async () => {
            const author = await UserFactory.create()
            const listing = await ListingFactory.create({
                author: {
                    connect: {
                        id: author.id,
                    },
                },
            })

            const input: UpdateListingInput = {
                description: faker.lorem.sentence(),
                id: listing.id,
                price: faker.datatype.number(),
                title: faker.lorem.words(),
            }

            const response = await executeOperation<
                UpdateListingMutation,
                UpdateListingMutationVariables
            >({
                permission: 'user',
                query: UPDATE_LISTING,
                user: {
                    id: author.id,
                },
                variables: {
                    input,
                },
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.updateListing.listing).toMatchObject<ListingPayloadFragment>(input)
        })

        it('should return AUTHENTICATION error if user not logged in', async () => {
            const response = await executeOperation<
                UpdateListingMutation,
                UpdateListingMutationVariables
            >({
                query: UPDATE_LISTING,
                variables: {
                    input: {
                        description: faker.lorem.word(),
                        id: faker.datatype.uuid(),
                        price: faker.datatype.number(),
                        title: faker.lorem.word(),
                    },
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHENTICATION)
            expect(response.body?.singleResult.data).toBeNull()
        })

        it('should return AUTHORIZATION error if user doesn\'t own that listing', async () => {
            const response = await executeOperation<
                UpdateListingMutation,
                UpdateListingMutationVariables
            >({
                permission: 'user',
                query: UPDATE_LISTING,
                variables: {
                    input: {
                        description: faker.lorem.word(),
                        id: faker.datatype.uuid(),
                        price: faker.datatype.number(),
                        title: faker.lorem.word(),
                    },
                },
            })

            expect(response.body?.singleResult.errors?.[0]?.extensions?.code).toBe(ErrorCode.AUTHORIZATION)
            expect(response.body?.singleResult.data).toBeNull()
        })
    })
})
