import { gql } from '@urql/core'
import map from 'ramda/src/map'
import partition from 'ramda/src/partition'
import pipe from 'ramda/src/pipe'
import { app } from '~/src/app'
import { stripGqlFields } from '~/src/util/gql'
import { Job } from '~/src/gql/fragments/jobs'

const log = require('~/src/logger').logger('actions/jobs/list')

export const ListJobs = gql`
  query ListJobs($input: ListJobsInput) {
    listJobs(input: $input) {
      jobConnection {
        items {
          ...Job
        }
        nextToken
      }
    }
  }
  ${Job}
`

export async function listJobs() {
  const { gqlClients, eph } = app()
  const resp = await gqlClients.jobs.query(ListJobs, {
    limit: 10,
  }).toPromise()

  if (resp.error) {
    log.warning('listJobs - error on response', { resp })
    return
  }

  const { items } = resp.data.listJobs.jobConnection
  log.debug('listJobs - got jobs; inserting', { 'items.length': items.length })

  const ids = items.map((j: any) => j.id)
  const jobsAlreadyInEphById = await eph().jobs.findByIds(ids)
  const [jobsToUpsert, jobsToInsert] = pipe(
    map(stripGqlFields),
    partition(j => jobsAlreadyInEphById.has(j.id))
  )(items)

  await Promise.all([
    // https://rxdb.info/rx-collection.html#atomicupsert; sadly no batch
    // operation available
    ...jobsToUpsert.map(job => eph().jobs.atomicUpsert(job)),
    // https://rxdb.info/rx-collection.html#bulkinsert
    eph().jobs.bulkInsert(jobsToInsert)
  ])
}
