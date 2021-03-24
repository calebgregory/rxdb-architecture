import { RxDatabase } from 'rxdb'
import { Client } from '@urql/core'

export interface App {
  gqlClients: {
    jobs: Client,
    content: Client,
  },
  db: () => RxDatabase<any>,
  eph: () => RxDatabase<any>,
}
