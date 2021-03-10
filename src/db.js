const path = require('path')
const { addRxPlugin, createRxDatabase } = require('rxdb')
const leveldown = require('leveldown')

addRxPlugin(require('pouchdb-adapter-leveldb')) // leveldown adapters need the leveldb plugin to work

let db
module.exports.createDB = async function createDB() {
  db = await createRxDatabase({
    name: path.resolve(__dirname, '../dev/db'),
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
