import { join } from 'path'

import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import {
    DateTimeTypeDefinition,
    NonPositiveFloatTypeDefinition,
} from 'graphql-scalars'

const contractTypeDefinitions = loadFilesSync(
    join(
        __dirname,
        '../**/*.graphql'
    ),
    { recursive: true }
)

export const typeDefs = mergeTypeDefs([
    DateTimeTypeDefinition,
    NonPositiveFloatTypeDefinition,
    contractTypeDefinitions,
])
