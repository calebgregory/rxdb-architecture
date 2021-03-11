const { createClient } = require('@urql/core')
const fetch = require('node-fetch')
const { initDB, initEphemeralDB } = require('~/src/db/init')
const config = require('~/config.json')

// config

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

// create gql clients

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
  await initEphemeralDB()

  const gqlClients = initGQLClients()

  return gqlClients
}
