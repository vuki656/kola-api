import { gql } from 'graphql-tag'

import { USER_FRAGMENT } from './fragments.graphql'

export const CREATE_USER = gql`
    mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
            user {
                ...UserPayload
            }
        }
    }
    ${USER_FRAGMENT}
`

export const UPDATE_USER = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
        updateUser(input: $input) {
            user {
                ...UserPayload
            }
        }
    }
    ${USER_FRAGMENT}
`

export const DELETE_USER = gql`
    mutation DeleteUser($input: DeleteUserInput!) {
        deleteUser(input: $input) {
            user {
                ...UserPayload
            }
        }
    }
    ${USER_FRAGMENT}
`
