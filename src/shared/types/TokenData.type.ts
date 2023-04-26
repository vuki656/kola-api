import type { User } from '../../resolvers/graphql-types.generated'

export type TokenDataType = {
    user: Pick<User, 'email' | 'firstName' | 'id' | 'lastName'>
}
