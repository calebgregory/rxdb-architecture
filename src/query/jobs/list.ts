import { gql } from '@urql/core'
import { app } from '~/src/app'
import { Job } from '~/src/gql/fragments/jobs'
import { bulkPut } from '~/src/util/rxdb/bulk-put'

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

  await bulkPut(eph().jobs, items)
}
