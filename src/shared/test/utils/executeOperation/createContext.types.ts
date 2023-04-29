import type { ExecuteOperationOptions } from '@apollo/server/dist/esm/externalTypes/graphql'

import type { Context } from '../../../../server'

export type CreateContextValue = Promise<ExecuteOperationOptions<Partial<Context>>['contextValue']>
