import { faker } from '@faker-js/faker'
import type { Prisma } from '@prisma/client'

import { orm } from '../../orm'
import { UserFactory } from './user.factory'

export const ListingFactory = {
    build: (input?: Partial<Prisma.ListingCreateWithoutAuthorInput>) => {
        return {
            updatedAt: new Date(),
            description: faker.lorem.sentence(),
            title: faker.lorem.words(),
            price: faker.datatype.number({ min: 0, max: 55_000 }),
            ...input,
        } satisfies Partial<Prisma.ListingCreateWithoutAuthorInput>
    },
    create: (input?: Partial<Prisma.ListingCreateInput>) => {
        return orm.listing.create({
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
            return orm.listing.create({
                data: {
                    ...ListingFactory.build(input),
                    author: {
                        create: UserFactory.build(),
                    }
                }
            })
        })

        return Promise.all(promises)
    },
}

