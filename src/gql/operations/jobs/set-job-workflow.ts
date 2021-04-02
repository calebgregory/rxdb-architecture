import { gql } from '@urql/core'
import { app } from '~/src/app'
import { Job } from '~/src/gql/fragments/jobs'
import { stripGqlFields } from '~/src/util/gql'

const log = require('~/src/logger').logger('mutation/jobs/set-job-workflow')

const HARDCODED_WORKFLOW = {
  "orgID": "XOi",
  "name": "Caleb Test Content Summary",
  "id": "wf-20210227220245calebtestcontentsummary",
  "steps": [
    {
      "name": "Summarize Video",
      "isKnowledgebaseContent": false,
      "isContentRequired": true,
      "isNoteRequired": false,
      "isContentSummaryRequired": true,
      "isCustomerFacing": true
    },
    {
      "name": "Don't Summarize Video, But Transcription",
      "isKnowledgebaseContent": false,
      "isContentRequired": true,
      "isNoteRequired": false,
      "isContentSummaryRequired": false,
      "isCustomerFacing": false
    },
    {
      "name": "No Transcript",
      "isKnowledgebaseContent": false,
      "isContentRequired": true,
      "isNoteRequired": false,
      "isContentSummaryRequired": false,
      "isCustomerFacing": false
    }
  ]
}

export const SetJobWorkflow = gql`
  mutation SetJobWorkflow($input: SetJobWorkflowInput!) {
    setJobWorkflow(input: $input) {
      job {
        ...Job
      }
    }
  }
  ${Job}
`

export async function setJobWorkflow(jobId: string) {
  const now = new Date().toISOString()
  const jobWorkflowFields = {
    steps: HARDCODED_WORKFLOW.steps,
    workflowName: HARDCODED_WORKFLOW.name,
    updatedAt: now
  }

  const { gqlClients, eph } = app()
  const resp = await gqlClients.jobs.query(SetJobWorkflow, {
    input: { id: jobId, jobWorkflowFields }
  }).toPromise()

  if (resp.error) {
    log.warning('setJobWorkflow - error on response', { resp })
    return
  }

  const { job } = resp.data.setJobWorkflow
  log.debug('setJobWorkflow - set job workflow; inserting', { job })

  await eph().jobs.atomicUpsert(stripGqlFields(job))
}
