/* eslint-disable @typescript-eslint/require-await -- Apollo plugin definition requires every step to be async */

import type { ApolloServerPlugin } from '@apollo/server'

import { logger } from '../../shared/logger'
import type { Context } from '../context'

export const ApolloPluginLogger: ApolloServerPlugin<Context> = {
    async requestDidStart(requestContext) {
        if (requestContext.request.operationName === 'IntrospectionQuery') {
            return
        }

        logger.info({
            message: 'Request started',
            operationName: requestContext.request.operationName,
            query: requestContext.request.query,
            variables: requestContext.request.variables,
        })

        return {
            async didEncounterErrors(errorContext) {
                for (const error of errorContext.errors) {
                    logger.error({
                        error,
                        message: 'Encountered error',
                    })
                }
            },
            async willSendResponse(responseContext) {
                logger.info({
                    message: 'Sending response',
                    response: responseContext.response,
                })
            },
        }
    },
}
