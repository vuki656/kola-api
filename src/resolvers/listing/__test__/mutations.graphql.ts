import { gql } from 'graphql-tag'

import { LISTING_FRAGMENT } from './fragments.graphql'

export const CREATE_LISTING = gql`
    mutation CreateListing($input: CreateListingInput!) {
        createListing(input: $input) {
            listing {
                ...ListingPayload
            }
        }
    }
    ${LISTING_FRAGMENT}
`

export const UPDATE_LISTING = gql`
    mutation UpdateListing($input: UpdateListingInput!) {
        updateListing(input: $input) {
            listing {
                ...ListingPayload
            }
        }
    }
    ${LISTING_FRAGMENT}
`

export const DELETE_LISTING = gql`
    mutation DeleteListing($input: DeleteListingInput!) {
        deleteListing(input: $input) {
            listing {
                ...ListingPayload
            }
        }
    }
    ${LISTING_FRAGMENT}
`
