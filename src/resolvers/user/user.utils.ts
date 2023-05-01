import { sign } from 'jsonwebtoken'

import type { Context } from '../../server'
import { env } from '../../shared/env'
import { AuthorizationError } from '../../shared/errors'
import type { TokenDataType } from '../../shared/types'

export const UserUtils = {
    checkIsPerformingOnSelf: (context: Context, id: string) => {
        if (context.user.nonNullValue.id !== id) {
            throw new AuthorizationError('You can\'t perform actions on other users')
        }
    },
    signToken: (tokenData: TokenDataType) => {
        return sign(
            tokenData,
            env.APP_JWT_SECRET,
            { expiresIn: env.APP_JWT_DURATION_SEC }
        )
    },
}
