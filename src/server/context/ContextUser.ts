import { AuthenticationError } from '../../shared/errors'

import type { TokenUser } from './context.types'

export class ContextUser {
    public value: TokenUser | null

    constructor(user: TokenUser | null) {
        this.value = user
    }

    public get nonNullValue() {
        if (!this.value) {
            throw new AuthenticationError()
        }

        return this.value
    }

    public clear() {
        this.value = null
    }
}
