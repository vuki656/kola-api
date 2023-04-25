import { faker } from '@faker-js/faker'

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
                query: LISTING_AUTHOR,
                variables: {
                    args: {
                        id: listing.id,
                    },
                },
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.listing.author.id).toBe(author.id)
        })
    })

    describe('when `deleteListing` mutation is called', () => {
        it('should delete the listing', async () => {
            const listing = await ListingFactory.create()

            const response = await executeOperation<
                DeleteListingMutation,
                DeleteListingMutationVariables
            >({
                query: DELETE_LISTING,
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
    })

    describe('when `listings` query is called', () => {
        it('should return listings', async () => {
            const COUNT = 20

            await ListingFactory.createMany(20)

            const response = await executeOperation<
                ListingsQuery,
                ListingsQueryVariables
            >({
                query: LISTINGS,
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.listings).toHaveLength(COUNT)
        })
    })

    describe('when `createListing` mutation is called', () => {
        it('should create listing', async () => {
            const author = await UserFactory.create()

            const input: CreateListingInput = {
                authorId: author.id,
                description: faker.lorem.sentence(),
                price: faker.datatype.number({ max: 55_000, min: 0 }),
                title: faker.lorem.words(),
            }

            const response = await executeOperation<
                CreateListingMutation,
                CreateListingMutationVariables
            >({
                query: CREATE_LISTING,
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
    })

    describe('when `updateListing` mutation is called', () => {
        it('should update listing', async () => {
            const listing = await ListingFactory.create()

            const input: UpdateListingInput = {
                description: faker.lorem.sentence(),
                id: listing.id,
                price: faker.datatype.number({ max: 55_000, min: 0 }),
                title: faker.lorem.words(),
            }

            const response = await executeOperation<
                UpdateListingMutation,
                UpdateListingMutationVariables
            >({
                query: UPDATE_LISTING,
                variables: {
                    input,
                },
            })

            expect(response.body?.singleResult.errors).toBeUndefined()
            expect(response.body?.singleResult.data?.updateListing.listing).toMatchObject<ListingPayloadFragment>(input)
        })
    })
})