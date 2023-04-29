import type { Prisma } from '@prisma/client'

import type { Context } from '../../../../server/context'
import { ContextUser } from '../../../../server/context/ContextUser'
import { orm } from '../../../orm'
import type { Permission } from '../../../utils'
import { UserFactory } from '../../factories'

import type { CreateContextValue } from './createContext.types'

const mockContext = async (input?: Partial<Prisma.UserCreateInput>): Promise<Partial<Context>> => {
    const user = await orm.user.create({
        data: {
            ...UserFactory.build(),
            ...input,
        },
        include: {
            listings: true,
        },
    })

    return {
        user: new ContextUser({
            ...user,
            listings: user.listings.map((listing) => {
                return {
                    ...listing,
                    price: listing.price.toNumber(),
                }
            }),
        }),
    }
}

export const createContext = async (permission?: Permission, input?: Partial<Prisma.UserCreateInput>): CreateContextValue => {
    switch (permission) {
        case 'isAdmin': {
            return mockContext({ 
                ...input,
                isAdmin: true,
            })
        }

        case 'isLoggedIn': {
            return mockContext({
                ...input,
                isAdmin: false,
            })
        }

        default: {
            return {
                user: new ContextUser(null),
            }
        }
    }
}
