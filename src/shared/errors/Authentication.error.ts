import type { GraphQLErrorOptions } from 'graphql'
import { GraphQLError } from 'graphql'

import { ErrorCode } from './Code'

export class AuthenticationError extends GraphQLError {
    constructor(
        message = 'You need to be logged to perform this action',
        options?: GraphQLErrorOptions
    ) {
        super(message, {
            ...options,
            extensions: {
                code: ErrorCode.AUTHENTICATION,
                ...options?.extensions,
            },
        })
    }
}
