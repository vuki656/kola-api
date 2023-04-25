import { startStandaloneServer } from '@apollo/server/standalone'

import {
    context,
    server,
} from './server'
import env from './shared/env'
import { logger } from './shared/logger'

void startStandaloneServer(server, {
    context,
    listen: {
        port: env.APP_PORT,
    },
})
    .then(({ url }) => {
        logger.info({
            message: 'Server started',
            url,
        })
    })
    .catch((error: unknown) => {
        logger.error({
            error,
            message: 'Server failed to start',
        })
    })

