/** @type { import('@types/eslint').ESLint.ConfigData } */
module.exports = {
    overrides: [
        {
            extends: 'plugin:@graphql-eslint/schema-all',
            files: ['./**/*.graphql'],
            parserOptions: {
                schema: './**/*.graphql',
            },
            rules: {
                '@graphql-eslint/no-scalar-result-type-on-mutation': 'off',
                '@graphql-eslint/require-description': 'off',
                '@graphql-eslint/require-field-of-type-query-in-mutation-result': 'off',
                '@graphql-eslint/strict-id-in-types': [
                    'error',
                    {
                        acceptedIdTypes: ['ID'],
                        exceptions: {
                            suffixes: [
                                'Payload',
                                'Pagination',
                            ],
                        },
                    },
                ],
            },
        },
        {
            extends: [require.resolve('@rimac-technology/style-guide/eslint/core')],
            files: ['./**/*.{js,ts,mjs}'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: './tsconfig.lint.json',
            },
        },
    ],
    ignorePatterns: ['*generated*'],
}
