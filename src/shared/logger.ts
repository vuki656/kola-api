import pino from 'pino'

import { env } from './env'

export const logger = pino({
    enabled: !env.isTest,
    level: env.APP_LOG_LEVEL,
    mixin: (_, level) => {
        return {
            severity: pino.levels.labels[level]?.toUpperCase(),
        }
    },
    redact: ['variables.input.password'],
})
