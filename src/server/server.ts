import http from 'http'

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'

import { logger } from '../shared/logger'

import type { Context } from './context'
import {
    ApolloPluginLandingPage,
    ApolloPluginLogger,
} from './plugins'
import { resolvers } from './resolvers'
import {
    apolloSecurityPlugins,
    apolloSecuritySettings,
    apolloSecurityValidationRules,
} from './security'
import { typeDefs } from './typeDefs'

export const expressApp = express()
export const httpServer = http.createServer(expressApp)

export const apolloServer = new ApolloServer<Context>({
    ...apolloSecuritySettings,
    logger,
    plugins: [
        ...apolloSecurityPlugins,
        ApolloPluginLandingPage,
        ApolloPluginLogger,
        ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
    resolvers,
    typeDefs,
    validationRules: apolloSecurityValidationRules,
})
