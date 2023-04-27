import type { GraphQLErrorOptions } from 'graphql'
import { GraphQLError } from 'graphql'

import { ErrorCode } from './Code'

export class ForbiddenError extends GraphQLError {
    constructor(
        message = 'You are not allowed the access the resource',
        options?: GraphQLErrorOptions
    ) {
        super(message, {
            ...options,
            extensions: {
                code: ErrorCode.FORBIDDEN,
                ...options?.extensions,
            },
        })
    }
}
