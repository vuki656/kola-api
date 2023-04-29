import type { Context } from '../../server'
import { AuthorizationError } from '../../shared/errors'

export const ListingUtils = {
    checkUserOwnsListing: (context: Context, id: string) => {
        const listingBelongToUser = context.user.nonNullValue.listings.some((listing) => {
            return listing.id === id
        })

        if (!listingBelongToUser) {
            throw new AuthorizationError('You can\' delete other users listings')
        }
    },
}
