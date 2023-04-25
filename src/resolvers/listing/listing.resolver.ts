import { orm } from '../../shared/orm'

import {
    createListingMutationValidation,
    deleteListingMutationValidation,
    listingQueryValidation,
    updateListingMutationValidation,
} from './list.validation'
import type { ListingModule } from './resolver-types.generated'

const ListingResolver: ListingModule.Resolvers = {
    Mutation: {
        createListing: async (_, variables) => {
            const { input } = createListingMutationValidation.parse(variables)

            const listing = await orm.listing.create({
                data: {
                    author: {
                        connect: {
                            id: input.authorId,
                        },
                    },
                    description: input.description,
                    price: input.price,
                    title: input.title,
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
