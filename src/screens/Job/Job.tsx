import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useObservableState } from 'observable-hooks'
import { app } from '~/src/app'
import { data } from '~/src/util/rxdb/operators'
import { getJob } from '~/src/gql/operations/jobs/get'
import { setJobWorkflow } from '~/src/gql/operations/jobs/set-job-workflow'
import { getJobTitle } from '~/src/util/jobs'
import { ContentThumbnail } from './ContentThumbnail'
import { Job as JobT } from '~/src/gql/types/jobs'

type Params = {
  id: string
}

export function getOwnerName(job: JobT): string {
  const { owner_info, owner } = job

  if (!owner_info) {
    return owner ?? 'N/A'
  }

  const { family_name, given_name } = owner_info
  return `${given_name} ${family_name}`
}

export function Job() {
  const { id } = useParams<Params>()

  useEffect(() => { getJob(id) }, [id])

  const job: JobT | null = useObservableState(
    app().eph().jobs.findOne().where('id').equals(id).$.pipe(data()),
    null
  )

  const handleSetWorkflowClick = () => setJobWorkflow(id)

  if (!job) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h1 id={job!.id}>{getJobTitle(job)}</h1>
      <h3>Owner: <span style={{ color: 'blue' }}>{getOwnerName(job!)}</span></h3>
      <br />
      {!Boolean(job!.workflowName)
        ? <button onClick={handleSetWorkflowClick}>Set this job's workflow!</button>
        : null}
      <div>
        {job!.steps.map((step: any) => {
          const key = `${job!.id}.${step.name}`
          return <div key={key} id={key}>
            <h3>{step.name}</h3>
            <div>
              {step.documentation.map((doc: any) => {
                const key = `${job!.id}.${step.name}.${doc.contentID}`
                return <ContentThumbnail key={key} id={doc.contentID} />
               })}
            </div>
          </div>
         })}
      </div>
    </div>
  )
}
