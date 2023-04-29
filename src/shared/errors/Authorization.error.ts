import type { GraphQLErrorOptions } from 'graphql'
import { GraphQLError } from 'graphql'

import { ErrorCode } from './Code'

export class AuthorizationError extends GraphQLError {
    constructor(
        message = 'You need don\'t have permission to perform this action',
        options?: GraphQLErrorOptions
    ) {
        super(message, {
            ...options,
            extensions: {
                code: ErrorCode.AUTHORIZATION,
                ...options?.extensions,
            },
        })
    }
}
