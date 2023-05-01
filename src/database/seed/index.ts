import { logger } from '../../shared/logger'
import { orm } from '../../shared/orm'
import { wipeDatabase } from '../../shared/test/utils'

import { userSeed } from './user'

const seedDatabase = async () => {
    await wipeDatabase()

    await orm
        .$transaction([
            ...userSeed,
        ])
        .then(() => {
            logger.info('Seed successful')
        })
        .catch((error: unknown) => {
            logger.error(error)

            process.exit()
        })
        .finally(() => {
            logger.info('Seed finished')

            void orm.$disconnect()
        })
}

void seedDatabase()
