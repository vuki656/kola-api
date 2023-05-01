import { logger } from '../../shared/logger'
import { orm } from '../../shared/orm'

import { userSeed } from './user'

void orm
    .$transaction([
        ...userSeed,
    ])
    .then(() => {
        logger.info("Seed successful")
    })
    .catch((error: unknown) => {
        logger.error(error)

        process.exit()
    })
    .finally(() => {
        logger.info("Seed finished")

        void orm.$disconnect()
    })
