import fs from 'fs'
import path from 'path'
import leveldown from 'leveldown'
import { addRxPlugin, createRxDatabase } from 'rxdb'
import { App } from '~/src/app/types'
import { app, destroy as destroyApp } from  '~/src/app'
import { initGQLClients } from '~/src/app/init'
import { persistentStoreCollections, createEphemeralDB } from '~/src/db'
import { Credentials, authenticateUser } from '~/src/services/aws-cognito-auth'
import defaultCredentials from '~/integration-tests/test-credentials.json'


addRxPlugin(require('pouchdb-adapter-leveldb')) // leveldown adapters need the leveldb plugin to work
// persistent database

const DB_DIR_PATH = path.resolve(__dirname, '../test-db')
async function createTestDB() {
  if (!fs.existsSync(DB_DIR_PATH)) {
    fs.mkdirSync(DB_DIR_PATH)
  }

  const db = await createRxDatabase({ name: `${DB_DIR_PATH}/db`, adapter: leveldown })
  await db.addCollections(persistentStoreCollections)
  return db
}

interface SetupOptions {
  credentials?: Credentials
}

export async function init({ credentials = defaultCredentials }: SetupOptions = {}): Promise<App> {
  const session = await authenticateUser(credentials)
  const gqlClients = initGQLClients(session)
  const db = await createTestDB()
  const eph = await createEphemeralDB()

  const app = { gqlClients, db: () => db, eph: () => eph }
  return app
}

export async function destroy() {
  const { db, eph } = app()
  await db().destroy()
  await eph().destroy()
  destroyApp()
}
