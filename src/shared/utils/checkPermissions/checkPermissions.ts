import type { Context } from '../../../server'
import {
    AuthenticationError,
    AuthorizationError,
} from '../../errors'

import type { Permission } from './checkPermissions.types'

export const checkPermissions = (context: Context, permissions: Permission[]) => {
    permissions.forEach((permission) => {
        switch (permission) {
            case 'isLoggedIn': {
                if (!context.user.value) {
                    throw new AuthenticationError()
                }

                break
            }

            case 'isAdmin': {
                if (!context.user.value?.isAdmin) {
                    throw new AuthorizationError()
                }

                break
            }
        }
    })
}
