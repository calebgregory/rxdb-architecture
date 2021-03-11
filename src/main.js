const { init } = require('~/src/init')
const { makeAccessible } = require('~/src/app')
const { ListJobs } = require('~/src/gql/jobs/ListJobs')
const { GetJob } = require('~/src/gql/jobs/GetJob')

async function main() {
  const app = await init()
  makeAccessible(app)

  require('~/src/view/root')
  require('~/src/logger/server.js')
}

main()
