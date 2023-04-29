import type { ExpressContextFunctionArgument } from '@apollo/server/dist/esm/express4'
import { verify } from 'jsonwebtoken'

import { env } from '../../shared/env'
import { logger } from '../../shared/logger'

import type {
    Context,
    TokenUser,
} from './context.types'
import { tokenValidation } from './context.validation'
import { ContextUser } from './ContextUser'

// eslint-disable-next-line @typescript-eslint/require-await -- Apollo context has to be async
export const context = async ({ req, res }: ExpressContextFunctionArgument): Promise<Context> => {
    const [,token] = req.headers.cookie?.split('=') ?? []

    let user: TokenUser | null = null

    try {
        const verifiedToken = verify(token ?? '', env.APP_JWT_SECRET)
        const tokenData = tokenValidation.parse(verifiedToken)

        user = tokenData.user
    } catch (error: unknown) {
        logger.debug({
            error,
            message: 'Error while parsing auth header',
            req,
        })
    }

    return {
        req,
        res,
        user: new ContextUser(user),
    }
}
