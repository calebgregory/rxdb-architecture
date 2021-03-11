const { app } = require('~/src/app')
const { eph } = require('~/src/db')
const { GetJob } = require('~/src/gql/jobs/GetJob')
const { ListJobs } = require('~/src/gql/jobs/ListJobs')

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

module.exports.listJobs = async function listJobs() {
  const resp = await app().jobsClient.query(ListJobs, {
    limit: 10,
  }).toPromise()

  if (resp.error) {
    console.error('error', resp.error)
    process.exit(1)
  }

  const { items } = resp.data.listJobs.jobConnection

  await eph().jobs.bulkInsert(items)
}