import type { Context } from './context.types'

// eslint-disable-next-line @typescript-eslint/require-await -- Apollo context has to be async
export const context = async (): Promise<Context> => {
    return {
        user: {},
    }
}
