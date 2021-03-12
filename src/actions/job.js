const { GetJob } = require('~/src/gql/jobs/GetJob')
const { ListJobs } = require('~/src/gql/jobs/ListJobs')
const { stripGqlFields } = require('~/src/util/gql')

const log = require('~/src/logger').logger('actions/jobs')

module.exports.getJob = async function getJob({ app }, id) {
  const { eph, gqlClients } = app()

  const resp = await gqlClients.jobs.query(GetJob, {
    id
  }).toPromise()

  if (resp.error) {
    log.warning('getJob - error on response', { resp })
    return
  }

  const { job } = resp.data.getJob
  log.debug('getJob - got job; inserting', { job })

  await eph().jobs.insert(stripGqlFields(job))
}

module.exports.listJobs = async function listJobs({ app, eph }) {
  const resp = await app().jobsClient.query(ListJobs, {
    limit: 10,
  }).toPromise()

  if (resp.error) {
    log.warning('listJobs - error on response', { resp })
    return
  }

  const { items } = resp.data.listJobs.jobConnection
  log.debug('listJobs - got jobs; inserting', { 'items.length': items.length })

  await eph().jobs.bulkInsert(items.map(stripGqlFields))
}