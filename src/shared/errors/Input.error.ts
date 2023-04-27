import type { GraphQLErrorOptions } from 'graphql'
import { GraphQLError } from 'graphql'

import { ErrorCode } from './Code'

export class InputError extends GraphQLError {
    constructor(
        message = 'Invalid input',
        options?: GraphQLErrorOptions
    ) {
        super(message, {
            ...options,
            extensions: {
                code: ErrorCode.INPUT,
                ...options?.extensions,
            },
        })
    }
}
