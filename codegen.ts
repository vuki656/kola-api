import type { CodegenConfig } from '@graphql-codegen/cli'

export const SCHEMA_FILES_LOCATION = './src/**/*.graphql'

const config: CodegenConfig = {
    generates: {
        './src/resolvers/': {
            config: {
                contextType: '../server/context/context.types#Context',
                defaultMapper: 'DeepPartial<{T}>',
                scalars: {
                    DateTime: 'Date',
                },
                useIndexSignature: true,
            },
            plugins: [
                'typescript',
                'typescript-resolvers',
                {
                    add: {
                        content: 'type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]>; } : T;',
                    },
                },
            ],
            preset: 'graphql-modules',
            presetConfig: {
                baseTypesPath: 'graphql-types.generated.ts',
                filename: 'resolver-types.generated.ts',
                useGraphQLModules: false,
            },
        },
    },
    hooks: {
        afterOneFileWrite: ['prettier --write'],
    },
    overwrite: true,
    schema: SCHEMA_FILES_LOCATION,
}

export default config
