import { gql } from '@urql/core'
import { app } from '~/src/app'
import { stripGqlFields } from '~/src/util/gql'
import { Job } from '~/src/gql/fragments/jobs'

const log = require('~/src/logger').logger('actions/jobs/get')

export const GetJob = gql`
  query GetJob($id: ID!) {
    getJob(input: { id: $id }) {
      job {
        ...Job
      }
    }
  }
  ${Job}
`

export async function getJob(id: string) {
  const { eph, gqlClients } = app()

  const resp = await gqlClients.jobs.query(GetJob, {
    id
  }).toPromise()

  if (resp.error) {
    log.warning('getJob - error on response', { resp })
    return
  }

  const job = stripGqlFields(resp.data.getJob.job)
  log.debug('getJob - got job; inserting', { job })

  await eph().jobs.atomicUpsert(job)
}
