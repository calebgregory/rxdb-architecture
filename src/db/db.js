const fs = require('fs')
const path = require('path')
const { addRxPlugin, createRxDatabase } = require('rxdb')
const leveldown = require('leveldown')

const DB_DIR_PATH = path.resolve(__dirname, '../../dev')

addRxPlugin(require('pouchdb-adapter-leveldb')) // leveldown adapters need the leveldb plugin to work
addRxPlugin(require('pouchdb-adapter-memory'))

let db
module.exports.createDB = async function createDB() {
  if (!fs.existsSync(DB_DIR_PATH)) {
    fs.mkdirSync(DB_DIR_PATH)
  }

  db = await createRxDatabase({
    name: DB_DIR_PATH + '/db',
    adapter: leveldown // the full leveldown-module
  })
  return db
}
module.exports.db = () => {
  if (!db) {
    throw new Error('db has not been created!')
  }
  return db
}

let eph
module.exports.createEphemeralDB = async function createEphemeralDB() {
  if (!fs.existsSync(DB_DIR_PATH)) {
    fs.mkdirSync(DB_DIR_PATH)
  }

  eph = await createRxDatabase({
    name: DB_DIR_PATH + '/eph',
    adapter: 'memory'
  })
  return eph
}
module.exports.eph = () => {
  if (!eph) {
    throw new Error('db has not been created!')
  }
  return eph
}
