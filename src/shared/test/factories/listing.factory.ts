import { faker } from '@faker-js/faker'
import type { Prisma } from '@prisma/client'

import { orm } from '../../orm'

import { UserFactory } from './user.factory'

export const ListingFactory = {
    build: (input?: Partial<Prisma.ListingCreateWithoutAuthorInput>) => {
        return {
            description: faker.lorem.sentence(),
            price: faker.datatype.number({ max: 55_000, min: 0 }),
            title: faker.lorem.words(),
            updatedAt: new Date(),
            ...input,
        } satisfies Partial<Prisma.ListingCreateWithoutAuthorInput>
    },
    create: (input?: Partial<Prisma.ListingCreateInput>) => {
        return orm.listing.create({ // @ts-expect-error // TODO: fix
            data: {
                ...ListingFactory.build(),
                author: {
                    create: UserFactory.build(),
                },
                ...input,
            },
        })
    },
    createMany: async (
        amount: number,
        input?: Partial<Prisma.ListingCreateInput>
    ) => {
        const promises = [...new Array(amount)].map(() => {
            return orm.listing.create({ // @ts-expect-error // TODO: fix
                data: {
                    ...ListingFactory.build(input),
                    author: {
                        create: UserFactory.build(),
                    },
                },
            })
        })

        return Promise.all(promises)
    },
}

