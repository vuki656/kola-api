import { verify } from 'jsonwebtoken'

import env from '../../shared/env'
import { logger } from '../../shared/logger'

import type {
    Context,
    ContextUserValue,
} from './context.types'
import { cookieValidation } from './context.validation'
import { ContextUser } from './ContextUser'
import { ExpressContextFunctionArgument } from '@apollo/server/dist/esm/express4'

// eslint-disable-next-line @typescript-eslint/require-await -- Apollo context has to be async
export const context = async ({ req, res }: ExpressContextFunctionArgument): Promise<Context> => {
    const [, token] = req.headers.authorization?.split(' ') ?? []

    let user: ContextUserValue | null = null

    try {
        const tokenData = verify(token ?? '', env.APP_JWT_SECRET)

        const { user: parsedUser } = cookieValidation.parse(tokenData)

        user = parsedUser
    } catch (error: unknown) {
        logger.trace({
            error,
            message: 'Error while parsing auth header',
            req,
        })
    }

    return {
        user: new ContextUser(user),
        req,
        res
    }
}
