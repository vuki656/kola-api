import { expressMiddleware } from '@apollo/server/express4'
import bodyParser from 'body-parser'
import cors from 'cors'

import {
    apolloServer,
    context,
    expressApp,
    httpServer,
} from './server'
import { env } from './shared/env'
import { logger } from './shared/logger'

export async function startServer() {
    await apolloServer
        .start()
        .then(() => {
            expressApp.use(
                '/',
                cors({
                    credentials: true,
                    origin: env.APP_CLIENT_ORIGINS,
                }),
                bodyParser.json({ limit: '50mb' }),
                expressMiddleware(apolloServer, {
                    context,
                }),
            )

            httpServer.listen({ port: env.APP_PORT })
        })
        .then(() => {
            logger.info(`Server starter on ${env.APP_PORT}`)
        })
        .catch((error: unknown) => {
            logger.error({
                error,
                message: 'Error starting server',
            })
        })
}

void startServer()
