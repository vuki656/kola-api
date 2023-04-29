import type {
    Request,
    Response,
} from 'express'
import type { z } from 'zod'

import type { tokenValidation } from './context.validation'
import type { ContextUser } from './ContextUser'

export type Context = {
    req: Request
    res: Response
    user: ContextUser
}

export type TokenUser = z.infer<typeof tokenValidation>['user']
