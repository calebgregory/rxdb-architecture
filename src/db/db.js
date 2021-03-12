const fs = require('fs')
const path = require('path')
const { addRxPlugin, createRxDatabase } = require('rxdb')
const leveldown = require('leveldown')
const YAML = require('yaml')

const DB_DIR_PATH = path.resolve(__dirname, '../../dev')

addRxPlugin(require('pouchdb-adapter-leveldb')) // leveldown adapters need the leveldb plugin to work
addRxPlugin(require('pouchdb-adapter-memory'))

// load schema

function loadYAML(relpath) {
  return YAML.parse(fs.readFileSync(path.resolve(__dirname, relpath), 'utf8'))
}

const jobsSchema = {
  ...loadYAML('./schema/jobs.yml'),
  ...require('./schema/__generated__/jobs.rxschema.json').definitions.Job
}

const viewSchema = loadYAML('./schema/view.yml')

// persistent database

module.exports.createDB = async function createDB() {
  if (!fs.existsSync(DB_DIR_PATH)) {
    fs.mkdirSync(DB_DIR_PATH)
  }

  const db = await createRxDatabase({
    name: DB_DIR_PATH + '/db',
    adapter: leveldown // the full leveldown-module
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

module.exports.createEphemeralDB = async function createEphemeralDB() {
  const eph = await createRxDatabase({
    name: DB_DIR_PATH + '/eph',
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