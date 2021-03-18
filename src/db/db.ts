import raw from 'raw.macro'
import { addRxPlugin, createRxDatabase } from 'rxdb'
import YAML from 'yaml'
import mergeDeepRight from 'ramda/src/mergeDeepRight'

addRxPlugin(require('pouchdb-adapter-idb'))
addRxPlugin(require('pouchdb-adapter-memory'))

// load schema

const jobsSchema = mergeDeepRight(
  require('~/src/db/schema/__generated__/jobs.rxschema.json').definitions.Job,
  YAML.parse(raw('~/src/db/schema/jobs.yml')),
)

const viewSchema = YAML.parse(raw('~/src/db/schema/view.yml'))

// persistent database

export async function createDB() {
  const db = await createRxDatabase({
    name: '/db',
    adapter: 'idb',
  })

  await db.addCollections({
    jobs: {
      schema: jobsSchema,
    },
    content: {
      schema: require('./schema/content.json')
    },
  })

  return db
}

// ephemeral database

export async function createEphemeralDB() {
  const eph = await createRxDatabase({
    name: '/eph',
    adapter: 'memory'
  })

  await eph.addCollections({
    jobs: {
      schema: jobsSchema,
    },
    content: {
      schema: require('./schema/content.json')
    },
    view: {
      schema: viewSchema,
    },
  })

  return eph
}
