import { ApolloArmor } from '@escape.tech/graphql-armor'

const armor = new ApolloArmor()

const {
    allowBatchedHttpRequests,
    includeStacktraceInErrorResponses,
    plugins,
    validationRules,
} = armor.protect()

export const apolloSecurityPlugins = plugins
export const apolloSecurityValidationRules = validationRules
export const apolloSecuritySettings = {
    allowBatchedHttpRequests,
    includeStacktraceInErrorResponses,
}

