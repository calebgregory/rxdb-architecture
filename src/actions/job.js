const { GetJob } = require('~/src/gql/jobs/GetJob')
const { ListJobs } = require('~/src/gql/jobs/ListJobs')
const { stripGqlFields } = require('~/src/util/gql')

module.exports.getJob = async function getJob({ app, eph }, id) {
  const resp = await app().jobsClient.query(GetJob, {
    id
  }).toPromise()

  if (resp.error) {
    console.error('error', resp.error)
    return
  }

  const { job } = resp.data.getJob

  await eph().jobs.insert(stripGqlFields(job))
}

module.exports.listJobs = async function listJobs({ app, eph }) {
  const resp = await app().jobsClient.query(ListJobs, {
    limit: 10,
  }).toPromise()

  if (resp.error) {
    console.error('error', resp.error)
    process.exit(1)
  }

  const { items } = resp.data.listJobs.jobConnection

  await eph().jobs.bulkInsert(items.map(stripGqlFields))
}