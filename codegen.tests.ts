import type { CodegenConfig } from '@graphql-codegen/cli'

import { SCHEMA_FILES_LOCATION } from './codegen'

const config: CodegenConfig = {
    documents: './src/resolvers/**/__test__/*.graphql.ts',
    generates: {
        './src/shared/test/types.generated.ts': {
            config: {
                scalars: {
                    DateTime: 'Date',
                },
            },
            plugins: [
                'typescript',
                'typescript-operations',
            ],
        },
    },
    hooks: {
        afterOneFileWrite: ['prettier --write'],
    },
    overwrite: true,
    schema: SCHEMA_FILES_LOCATION,
}

export default config
