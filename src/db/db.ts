// const fs = require('fs')
// const path = require('path')
// const leveldown = require('leveldown')
const raw = require('raw.macro')
const { addRxPlugin, createRxDatabase } = require('rxdb')
const YAML = require('yaml')

// const DB_DIR_PATH = path.resolve(__dirname, '../../dev')

// addRxPlugin(require('pouchdb-adapter-leveldb')) // leveldown adapters need the leveldb plugin to work
addRxPlugin(require('pouchdb-adapter-idb'))
addRxPlugin(require('pouchdb-adapter-memory'))

// load schema

// function loadYAML(relpath) {
//   return YAML.parse(fs.readFileSync(path.resolve(__dirname, relpath), 'utf8'))
// }

const jobsSchema = {
  ...YAML.parse(raw('~/src/db/schema/jobs.yml')),
  ...require('~/src/db/schema/__generated__/jobs.rxschema.json').definitions.Job
}

const viewSchema = YAML.parse(raw('~/src/db/schema/view.yml'))

// persistent database

export async function createDB() {
  // if (!fs.existsSync(DB_DIR_PATH)) {
  //   fs.mkdirSync(DB_DIR_PATH)
  // }

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
