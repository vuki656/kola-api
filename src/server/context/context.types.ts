import type { User } from '@prisma/client'

import type { ContextUser } from './ContextUser'

export type ContextUserValue = Pick<User, 'email' | 'firstName' | 'id' | 'lastName'>

export type Context = {
    user: ContextUser
}
