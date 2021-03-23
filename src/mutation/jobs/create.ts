import { gql } from '@urql/core'
import { app } from '~/src/app'
import { Job } from '~/src/gql/fragments/jobs'
import { stripGqlFields } from '../../util/gql'

const log = require('~/src/logger').logger('mutation/jobs/create')

export const CreateJob = gql`
  mutation CreateJob($input: CreateJobInput!) {
    createJob(input: $input) {
      job {
        ...Job
      }
    }
  }
  ${Job}
`

export async function createJob(id: string, newJobInput: any) {
  const now = new Date().toISOString()
  const newJob = { ...newJobInput, createdAt: now, updatedAt: now }

  const { gqlClients, eph } = app()
  const resp = await gqlClients.jobs.query(CreateJob, {
    input: { id, newJob }
  }).toPromise()

  if (resp.error) {
    log.warning('createJob - error on response', { resp })
    return
  }

  const { job } = resp.data.createJob
  log.debug('createJob - created job; inserting', { job })

  await eph().jobs.insert(stripGqlFields(job))
}
