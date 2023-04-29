import type { User } from '@prisma/client'
import type {
    Request,
    Response,
} from 'express'

import type { ContextUser } from './ContextUser'

export type ContextUserValue = Pick<User, 'email' | 'firstName' | 'id' | 'lastName'>

export type Context = {
    req: Request
    res: Response
    user: ContextUser
}
