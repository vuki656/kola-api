import { config } from 'dotenv'
import {
    cleanEnv,
    num,
    str,
} from 'envalid'

import { commaSeparatedString } from './validators'

config()

export const env = cleanEnv(process.env, {
    APP_CLIENT_ORIGINS: commaSeparatedString(),
    APP_JWT_DURATION_SEC: num(),
    APP_JWT_SECRET: str(),
    APP_LOG_LEVEL: str(),
    APP_PORT: num(),
    DB_PRISMA_URL: str(),
})
