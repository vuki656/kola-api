import type { Context } from '../../../server'
import {
    AuthenticationError,
    AuthorizationError,
} from '../../errors'

import type { Permission } from './checkPermissions.types'

// TODO: this does not make sense if we pass ['isLoggedIn', 'isAdmin'], it makes no sense for it to be array since here admin will be able to do everything logged in user will
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
