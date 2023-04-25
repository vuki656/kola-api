import { gql } from 'graphql-tag'

import { LISTING_FRAGMENT } from './fragments.graphql'

export const LISTING = gql`
    query Listing($args: ListingArgs!) {
         listing(args: $args) {
            ...ListingPayload
         }
     }
    ${LISTING_FRAGMENT}
`

export const LISTINGS = gql`
    query Listings {
         listings {
            ...ListingPayload
         }
     }
    ${LISTING_FRAGMENT}
`

export const LISTING_AUTHOR = gql`
    query ListingAuthor($args: ListingArgs!) {
        listing(args: $args) {
            id
            author {
                id
            }
        }
    }
`

