import { addRxPlugin, createRxDatabase } from 'rxdb'
import { schema } from './schema'

addRxPlugin(require('pouchdb-adapter-idb'))
addRxPlugin(require('pouchdb-adapter-memory'))

// persistent database

export const persistentStoreCollections = {
  jobs: { schema: schema.jobs },
  content: { schema: schema.content },
}

export const ephemeralStoreCollections = {
  jobs: { schema: schema.jobs },
  content: { schema: schema.content },
}

export async function createDB() {
  const db = await createRxDatabase({ name: 'db', adapter: 'idb' })
  await db.addCollections(persistentStoreCollections)
  return db
}

// ephemeral database

export async function createEphemeralDB() {
  const eph = await createRxDatabase({ name: 'eph', adapter: 'memory' })
  await eph.addCollections(ephemeralStoreCollections)
  return eph
}
