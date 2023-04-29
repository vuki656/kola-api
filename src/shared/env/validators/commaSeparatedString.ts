import { makeValidator } from 'envalid'

export const commaSeparatedString = makeValidator((value) => {
    const splitValue = value.split(',')

    if (splitValue.at(-1) === '') {
        throw new Error('Invalid comma separated string. You likely have a trailing ,')
    }

    return splitValue
})
