import type { Context } from '../../../server'
import {
    AuthenticationError,
    AuthorizationError,
} from '../../errors'

import type { Permission } from './checkPermissions.types'

export const checkPermissions = (context: Context, permissions: Permission[]) => {
    permissions.forEach((permission) => {
        switch (permission) {
            case 'user': {
                if (context.user.value) {
                    break
                }

                throw new AuthenticationError()
            }

            case 'admin': {
                if (context.user.value?.isAdmin) {
                    break
                }

                throw new AuthorizationError()
            }
        }
    })
}
