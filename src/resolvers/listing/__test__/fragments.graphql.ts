import { gql } from 'graphql-tag'

export const LISTING_FRAGMENT = gql`
    fragment ListingPayload on Listing {
        id
        title
        description
        price
    }
`

