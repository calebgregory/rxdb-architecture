const { app } = require('~/src/app')
const { eph } = require('~/src/db')
const { GetJob } = require('~/src/gql/jobs/GetJob')

module.exports.getJob = async function getJob(id) {
  const resp = await app().jobsClient.query(GetJob, {
    id
  }).toPromise()

  if (resp.error) {
    console.error('error', resp.error)
    process.exit(1)
  }

  const { job } = resp.data.getJob

  await eph().jobs.insert(job)
}
