import { gql } from 'graphql-tag'

import { USER_FRAGMENT } from './fragments.graphql'

export const CREATE_USER = gql`
    mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
            token
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

export const LOGIN_USER = gql`
    mutation LoginUser($input: LoginUserInput!) {
        loginUser(input: $input) {
            token
            user {
                ...UserPayload
            }
        }
    }
    ${USER_FRAGMENT}
`

export const CHANGE_USER_PASSWORD = gql`
    mutation ChangeUserPassword($input: ChangeUserPasswordInput!) {
        changeUserPassword(input: $input) {
            success
        }
    }
`
