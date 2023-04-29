import { gql } from 'graphql-tag'

export const USER_FRAGMENT = gql`
    fragment UserPayload on User {
        id
        firstName
        lastName
        email
        phoneNumber
        isAdmin
        oib
    }
`

