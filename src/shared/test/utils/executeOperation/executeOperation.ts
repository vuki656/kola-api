import type {
    ExecuteOperationOptions,
    VariableValues,
} from '@apollo/server/dist/esm/externalTypes/graphql'

import type { Context } from '../../../../server'
import { apolloServer } from '../../../../server'

import { createContext } from './createContext'
import type {
    ExecuteOperationReturnType,
    IncrementalResponseReturnType,
    RequestType,
    ResponseDataType,
    SingleResponseReturnType,
} from './executeOperation.types'

/*
 * This magic wrapper is needed because `executeOperation` returns a union
 * where the response can be 'single' or 'incremental' and we would need to
 * narrow it down in every test or cast
 *
 * With this it will automatically narrow it do the 'single' response type
 * but can also accept an 'incremental' response type and adjust the return
 * type based on that
 */
export const executeOperation = async <
    TData extends ResponseDataType,
    TVariables extends VariableValues,
    ExpectedType extends 'incremental' | 'single' = 'single'
>(
    request: RequestType<TData, TVariables>,
    options?: ExecuteOperationOptions<Context>,
    expectedTypeProp?: ExpectedType
): Promise<ExecuteOperationReturnType<ExpectedType, TData>> => {
    // eslint-disable-next-line unicorn/prefer-default-parameters -- Not valid in this case
    const expectedType = expectedTypeProp ?? 'single'

    const context = await createContext(request.permission, request.user)

    const response = await apolloServer.executeOperation<TData, TVariables>(request, {
        ...options, // It's fine to cast this since it complains about req/res missing and we don't use those since execute operation skips context resolution
        contextValue: context as Context,
    })

    const responseType = response.body.kind

    if (response.body.kind !== expectedType) {
        throw new Error(`Got ${responseType} as a response type. Expected ${expectedType}`)
    }

    if (
        expectedType === 'single' &&
        responseType === 'single'
    ) {
        return response as SingleResponseReturnType<TData>
    }

    if (
        expectedType === 'incremental' &&
        responseType === 'incremental'
    ) {
        return response as IncrementalResponseReturnType
    }

    throw new Error('Unexpected end of execute operation')
}
