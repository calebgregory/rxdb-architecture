const path = require('path')
const { gql, createClient } = require('@urql/core')
const fetch = require('node-fetch')

// config

const config = require('~/src/config.json')

const getUrl = (function _getUrl(config, apiName) {
  const endpoint = config.graphqlEndpoints.find(({ name }) => name === apiName)
  if (!endpoint) {
    throw new Error(`no url found for apiName {${apiName}} in config`)
  }
  return endpoint.url
}).bind(null, config)

const token = process.env.AUTH_TOKEN
if (!token) {
  throw new Error('no token at process.env.AUTH_TOKEN; please provide that')
}

// init

const { createDB } = require('~/src/db')

async function initDB() {
  const db = await createDB()

  await db.addCollections({
    jobs: {
      schema: require('~/src/db-schema/jobs.json')
    },
    content: {
      schema: require('~/src/db-schema/content.json')
    }
  })
}

function initGQLClients() {
  const _createClient = (apiName) => createClient({
    url: getUrl(apiName),
    fetchOptions: () => ({ headers: { authorization: token } }),
    fetch
  })

  const jobsClient = _createClient('jobs-v2')
  const contentClient = _createClient('content')

  return { jobsClient, contentClient }
}

module.exports.init = async function init() {
  await initDB()

  const gqlClients = initGQLClients()

  return gqlClients
}
