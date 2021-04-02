import { CognitoUserSession } from 'amazon-cognito-identity-js'
import { createClient } from '@urql/core'
import { createDB, createEphemeralDB } from '~/src/db'
import { authenticateUser, Credentials } from '~/src/services/aws-cognito-auth'
import { init as initLogger } from '~/src/logger/init'
import { Config } from '~/config.json'

const log = require('~/src/logger').logger('app/init')

// config

const getUrl = (config: Config, apiName: string): string => {
  const endpoint = config.graphqlEndpoints.find(({ name }) => name === apiName)
  if (!endpoint) {
    throw new Error(`no url found for apiName {${apiName}} in config`)
  }
  return endpoint.url
}

// create gql clients

export function initGQLClients(config: Config, session: CognitoUserSession) {
  const _createClient = (apiName: string) => createClient({
    url: getUrl(config, apiName),
    requestPolicy: 'network-only', // we don't rely on urql's cache at all
    fetchOptions: () => {
      // note: it is _very, very important_ that we use `idToken` here
      const token = session.getIdToken().getJwtToken()
      return { headers: { authorization: token } } as RequestInit
    },
  })

  const jobsClient = _createClient('jobs-v2')
  const contentClient = _createClient('content')

  return { jobs: jobsClient, content: contentClient }
}

// init

export async function init(config: Config, credentials: Credentials): Promise<App> {
  initLogger()

  const session = await authenticateUser(credentials)
  log.debug('authenticated user; got session', { session })

  const db = await createDB()
  const eph = await createEphemeralDB()

  const gqlClients = initGQLClients(config, session)

  const app = { db: () => db, eph: () => eph, gqlClients }
  return app
}
