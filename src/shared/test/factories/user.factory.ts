import { faker } from '@faker-js/faker'
import type { Prisma } from '@prisma/client'

import { OIB_LENGTH } from '../../constants'
import { orm } from '../../orm'
import { hash } from 'bcrypt'

export const UserFactory = {
    password: {
        raw: '123123123',
        hash: '$2b$10$v0Dpt/lISq9GZJXcubjlree57ii/3KIEPKjkFjBCPaK8z/F1Mdwu.'
    },
    build: (input?: Partial<Prisma.UserCreateInput>) => {
        return {
            email: faker.internet.email(),
            firstName: faker.name.firstName(),
            isAdmin: false,
            lastName: faker.name.lastName(),
            oib: faker.datatype.string(OIB_LENGTH),
            password: UserFactory.password.hash,
            phoneNumber: faker.phone.number(),
            updatedAt: new Date(),
            ...input,
        } satisfies Prisma.UserCreateInput
    },
    create: async (input?: Partial<Prisma.UserCreateInput>) => {
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

