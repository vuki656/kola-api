import type { HTTPGraphQLHead } from '@apollo/server'
import type {
    GraphQLResponseBody,
    VariableValues,
} from '@apollo/server/dist/esm/externalTypes/graphql'
import type { Prisma } from '@prisma/client'

import type { apolloServer } from '../../../../server'
import type { Permission } from '../../../utils'

type BaseResponse = {
    http: HTTPGraphQLHead
}

export type ResponseDataType = Record<string, unknown>

export type RequestType<
    TData extends ResponseDataType,
    TVariables extends VariableValues
> = Parameters<typeof apolloServer.executeOperation<TData, TVariables>>[0] & {
    permission?: Permission
    user?: Partial<Prisma.UserCreateInput>
}

export type SingleResponseReturnType<TData extends ResponseDataType> = BaseResponse & {
    body?: Extract<GraphQLResponseBody<TData>, { kind: 'single' }>
}

export type IncrementalResponseReturnType = BaseResponse & {
    body?: Extract<GraphQLResponseBody, { kind: 'incremental' }>
}

export type ExecuteOperationReturnType<
    ExpectedType extends string,
    TData extends ResponseDataType
> = ExpectedType extends 'single'
    ? SingleResponseReturnType<TData>
    : IncrementalResponseReturnType
