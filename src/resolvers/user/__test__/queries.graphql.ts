import { gql } from 'graphql-tag'

import { USER_FRAGMENT } from './fragments.graphql'

export const USER = gql`
    query User($args: UserArgs!) {
         user(args: $args) {
            ...UserPayload
         }
     }
    ${USER_FRAGMENT}
`

export const USERS = gql`
    query Users {
         users {
            ...UserPayload
         }
     }
    ${USER_FRAGMENT}
`

export const USER_LISTINGS = gql`
    query UserListings($args: UserArgs!) {
        user(args: $args) {
            id
            listings {
                id
            }
        }
    }
`

