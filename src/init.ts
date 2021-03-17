import { createClient } from '@urql/core'
import partial from 'ramda/src/partial'
import { createDB, createEphemeralDB } from '~/src/db'
import config, { Config } from '~/config.json'

// config

const getUrl = partial((config: Config, apiName: string): string => {
  const endpoint = config.graphqlEndpoints.find(({ name }) => name === apiName)
  if (!endpoint) {
    throw new Error(`no url found for apiName {${apiName}} in config`)
  }
  return endpoint.url
}, [config])

const token = process.env.AUTH_TOKEN
if (!token) {
  throw new Error('no token at process.env.AUTH_TOKEN; please provide that')
}

// create gql clients

function initGQLClients() {
  const _createClient = (apiName: string) => createClient({
    url: getUrl(apiName),
    fetchOptions: () => ({ headers: { authorization: token } } as RequestInit),
  })

  const jobsClient = _createClient('jobs-v2')
  const contentClient = _createClient('content')

  return { jobs: jobsClient, content: contentClient }
}

export async function init() {
  const db = await createDB()
  const eph = await createEphemeralDB()

  const gqlClients = initGQLClients()

  const app = { db, eph, gqlClients }
  return app
}
