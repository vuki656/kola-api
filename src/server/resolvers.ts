import { join } from 'path'

import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers } from '@graphql-tools/merge'
import {
    DateTimeResolver,
    NonNegativeFloatResolver,
} from 'graphql-scalars'

const resolverFiles = loadFilesSync(
    join(
        __dirname,
        '../resolvers/**/*.resolver.*'
    ),
    { recursive: true }
)

export const resolvers = {
    DateTime: DateTimeResolver,
    NonNegativeFloat: NonNegativeFloatResolver,
    ...mergeResolvers(resolverFiles),
}
