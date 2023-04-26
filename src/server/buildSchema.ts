import { writeFileSync } from 'fs'

import { print } from 'graphql'

import { typeDefs } from './typeDefs'

writeFileSync('./schema.graphql', print(typeDefs))
