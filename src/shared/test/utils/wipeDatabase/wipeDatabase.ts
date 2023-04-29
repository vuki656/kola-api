import { env } from '../../../env'
import { logger } from '../../../logger'
import { orm } from '../../../orm'

import type { Table } from './wipeDatabase.types'

// Taken from https://www.prisma.io/docs/concepts/components/prisma-client/crud#deleting-all-data-with-raw-sql--truncate
export const wipeDatabase = async () => {
    const tableNames = await orm.$queryRaw<Table[]>`SELECT tablename FROM pg_tables WHERE schemaname=${env.DB_PRISMA_URL}`

    const tables = tableNames
        .map(({ tablename }) => `"${env.DB_PRISMA_URL}"."${tablename}"`)
        .join(', ')

    await orm
        .$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
        .then(() => {
            logger.info('🚀 Database Wiped')
        })
        .catch((error: unknown) => {
            logger.error({
                error,
                message: '💣 Failed to wipe database',
            })
        })
}
