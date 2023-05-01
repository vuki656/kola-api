import { orm } from '../../shared/orm'
import { UserFactory } from '../../shared/test/factories'

const removeUsers = orm.user.deleteMany()

const createUsers = orm.user.createMany({
    data: [
        {
            email: 'off.vukovic@gmail.com',
            firstName: 'Domagoj',
            isAdmin: true,
            lastName: 'Vukovic',
            oib: '11111111112',
            password: UserFactory.password.hash,
            phoneNumber: '0993998993',
            updatedAt: new Date(),
        },
        {
            email: 'flukacev@gmail.com',
            firstName: 'Filip',
            isAdmin: true,
            lastName: 'Lukacevic',
            oib: '11111111111',
            password: UserFactory.password.hash,
            phoneNumber: '0993998992',
            updatedAt: new Date(),
        },
    ],
})

export const userSeed = [
    removeUsers,
    createUsers,
]
