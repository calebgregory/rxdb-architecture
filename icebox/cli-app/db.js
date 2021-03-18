const fs = require('fs')
const path = require('path')
const leveldown = require('leveldown')
const { addRxPlugin } = require('rxdb')

const DB_DIR_PATH = path.resolve(__dirname, '../../dev')

addRxPlugin(require('pouchdb-adapter-leveldb')) // leveldown adapters need the leveldb plugin to work

function loadYAML(relpath) {
  return YAML.parse(fs.readFileSync(path.resolve(__dirname, relpath), 'utf8'))
}

// persistent database

export async function createDB() {
  if (!fs.existsSync(DB_DIR_PATH)) {
    fs.mkdirSync(DB_DIR_PATH)
  }
  // ...
}
