const { init } = require('~/src/init')
const { makeAccessible } = require('~/src/app')
const { ListJobs } = require('~/src/gql/jobs/ListJobs')
const { GetJob } = require('~/src/gql/jobs/GetJob')

/**
  const resp = await jobsClient.query(ListJobs, {
    limit: 10,
  }).toPromise()

  if (resp.error) {
    console.error('error', resp.error)
    process.exit(1)
  }

  const { items } = resp.data.listJobs.jobConnection

  console.log('ListJobs', { items })
*/

async function main() {
  const app = await init()
  makeAccessible(app)

  // require('~/src/view/root')
  require('~/src/logger/server.js')
}

main({ jobId: "job-0e1ae43c-7b18-i144-f8d740abb619-uA0B-9877d0a024d0" })
