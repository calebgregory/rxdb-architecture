import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useObservableState } from 'observable-hooks'
import { app } from '~/src/app'
import { getJob } from '~/src/query/jobs/get'
import { getJobTitle } from '~/src/util/jobs'
import { ContentThumbnail } from './ContentThumbnail'

type Params = {
  id: string
}

function getOwnerName({ family_name, given_name }: any): string {
  return `${given_name} ${family_name}`
}

export function Job() {
  const { id } = useParams<Params>()

  useEffect(() => { getJob(id) }, [id])

  const job: any = useObservableState(app().eph().jobs.findOne().where('id').equals(id).$, null)

  if (!job) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h1 id={job.id}>{getJobTitle(job)}</h1>
      <h3>Owner: <span style={{ color: 'blue' }}>{getOwnerName(job.owner_info)}</span></h3>
      <br />
      <div>
        {job.steps.map((step: any) => {
          const key = `${job.id}.${step.name}`
          return <div key={key} id={key}>
            <h3>{step.name}</h3>
            <div>
              {step.documentation.map((doc: any) => {
                const key = `${job.id}.${step.name}.${doc.contentID}`
                return <ContentThumbnail key={key} id={doc.contentID} />
               })}
            </div>
          </div>
         })}
      </div>
    </div>
  )
}
