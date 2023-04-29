import { orm } from '../../shared/orm'
import { checkPermissions } from '../../shared/utils'

import { ListingUtils } from './listing.utils'
import {
    createListingMutationValidation,
    deleteListingMutationValidation,
    listingQueryValidation,
    updateListingMutationValidation,
} from './listing.validation'
import type { ListingModule } from './resolver-types.generated'

const ListingResolver: ListingModule.Resolvers = {
    Listing: {
        author: (parent, _, context) => {
            checkPermissions(context, ['user'])

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
            checkPermissions(context, ['user'])

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
        deleteListing: async (_, variables, context) => {
            checkPermissions(context, ['user'])

            const { input } = deleteListingMutationValidation.parse(variables)

            ListingUtils.checkUserOwnsListing(context, input.id)

            const listing = await orm.listing.delete({
                where: {
                    id: input.id,
                },
            })

            return {
                listing,
            }
        },
        updateListing: async (_, variables, context) => {
            checkPermissions(context, ['user'])

            const { input } = updateListingMutationValidation.parse(variables)

            ListingUtils.checkUserOwnsListing(context, input.id)

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
        listing: (_, variables, context) => {
            checkPermissions(context, ['user'])

            const { args } = listingQueryValidation.parse(variables)

            return orm.listing.findUniqueOrThrow({
                where: {
                    id: args.id,
                },
            })
        },
        listings: async (_, __, context) => {
            checkPermissions(context, ['user'])

            return orm.listing.findMany()
        },
    },
}

export default ListingResolver
