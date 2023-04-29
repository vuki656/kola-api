import { orm } from '../../shared/orm'

import {
    createListingMutationValidation,
    deleteListingMutationValidation,
    listingQueryValidation,
    updateListingMutationValidation,
} from './listing.validation'
import type { ListingModule } from './resolver-types.generated'

const ListingResolver: ListingModule.Resolvers = {
    Listing: {
        author: (parent) => {
            return orm.user.findFirstOrThrow({
                where: {
                    listings: {
                        some: {
                            id: parent.id,
                        },
                    },
                },
            })
        },
    },
    Mutation: {
        createListing: async (_, variables, context) => {
            const { input } = createListingMutationValidation.parse(variables)

            const listing = await orm.listing.create({
                data: {
                    author: {
                        connect: {
                            id: context.user.nonNullValue.id,
                        },
                    },
                    description: input.description,
                    price: input.price,
                    title: input.title,
                    updatedAt: new Date(),
                },
            })

            return {
                listing,
            }
        },
        deleteListing: async (_, variables) => {
            const { input } = deleteListingMutationValidation.parse(variables)

            const listing = await orm.listing.delete({
                where: {
                    id: input.id,
                },
            })

            return {
                listing,
            }
        },
        updateListing: async (_, variables) => {
            const { input } = updateListingMutationValidation.parse(variables)

            const listing = await orm.listing.update({
                data: {
                    description: input.description,
                    price: input.price,
                    title: input.title,
                    updatedAt: new Date(),
                },
                where: {
                    id: input.id,
                },
            })

            return {
                listing,
            }
        },
    },
    Query: {
        listing: (_, variables) => {
            const { args } = listingQueryValidation.parse(variables)

            return orm.listing.findUniqueOrThrow({
                where: {
                    id: args.id,
                },
            })
        },
        listings: async () => {
            return orm.listing.findMany()
        },
    },
}

export default ListingResolver
