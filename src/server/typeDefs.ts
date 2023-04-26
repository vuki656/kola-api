import { join } from 'path'

import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import {
    DateTimeTypeDefinition,
    NonNegativeFloatTypeDefinition,
} from 'graphql-scalars'

const contractTypeDefinitions = loadFilesSync(
    join(
        __dirname,
        '../**/*.graphql'
    ),
    { recursive: true }
)

// TODO: since we are importing scalars here into the schema, it should not be needed to have a scalars.graphql file where we define them again
export const typeDefs = mergeTypeDefs([
    DateTimeTypeDefinition,
    NonNegativeFloatTypeDefinition,
    contractTypeDefinitions,
])
