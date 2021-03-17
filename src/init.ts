import { CognitoUserSession } from 'amazon-cognito-identity-js'
import { createClient } from '@urql/core'
import { createDB, createEphemeralDB } from '~/src/db'
import { authenticateUser, Credentials } from '~/src/services/aws-cognito-auth'
import config from '~/config.json'

// config

const getUrl = (apiName: string): string => {
  const endpoint = config.graphqlEndpoints.find(({ name }) => name === apiName)
  if (!endpoint) {
    throw new Error(`no url found for apiName {${apiName}} in config`)
  }
  return endpoint.url
}

// create gql clients

function initGQLClients(session: CognitoUserSession) {
  const _createClient = (apiName: string) => createClient({
    url: getUrl(apiName),
    fetchOptions: () => {
      const token = session.getAccessToken().getJwtToken()
      return { headers: { authorization: token } } as RequestInit
    },
  })

  const jobsClient = _createClient('jobs-v2')
  const contentClient = _createClient('content')

  return { jobs: jobsClient, content: contentClient }
}

export async function init(credentials: Credentials) {
  const session = await authenticateUser(credentials)

  const db = await createDB()
  const eph = await createEphemeralDB()

  const gqlClients = initGQLClients(session)

  const app = { db, eph, gqlClients }
  return app
}
