import { config } from 'dotenv'
import {
    cleanEnv,
    num,
    str,
} from 'envalid'

config()

const env = cleanEnv(process.env, {
    APP_JWT_DURATION_SEC: num(),
    APP_JWT_SECRET: str(),
    APP_LOG_LEVEL: str(),
    APP_PORT: num(),
    DB_PRISMA_URL: str(),
    DB_SCHEMA: str(),
})

export default env
