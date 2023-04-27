import { ForbiddenError } from '../../shared/errors'

import type { ContextUserValue } from './context.types'

export class ContextUser {
    public value: ContextUserValue | null

    constructor(user: ContextUserValue | null) {
        this.value = user
    }

    public get nonNullValue() {
        if (!this.value) {
            throw new ForbiddenError()
        }

        return this.value
    }
}
