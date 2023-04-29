import type { Context } from '../../server'
import { AuthorizationError } from '../../shared/errors'

export const UserUtils = {
    checkIsPerformingOnSelf: (context: Context, id: string) => {
        if (context.user.nonNullValue.id !== id) {
            throw new AuthorizationError('You can\'t perform actions on other users')
        }
    },
}
