import { faker } from '@faker-js/faker'
import type { Prisma } from '@prisma/client'

import { orm } from '../../orm'

export const UserFactory = {
    build: (input?: Partial<Prisma.UserCreateInput>) => {
        return {
            email: faker.internet.email(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            updatedAt: new Date(),
            ...input,
        } satisfies Prisma.UserCreateInput
    },
    create: (input?: Partial<Prisma.UserCreateInput>) => {
        return orm.user.create({
            data: {
                ...UserFactory.build(),
                ...input,
            },
        })
    },
    createMany: async (
        amount: number,
        input?: Partial<Prisma.UserCreateInput>
    ) => {
        const promises = [...new Array(amount)].map(() => {
            return orm.user.create({
                data: UserFactory.build(input),
            })
        })

        return Promise.all(promises)
    },
}

