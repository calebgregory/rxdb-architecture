import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useObservableState } from 'observable-hooks'
import { app } from '~/src/app'
import { getJob } from '~/src/actions/jobs/get'
import { getJobTitle } from '~/src/util/jobs'

type Params = {
  id: string
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
      <br />
      <div>
        {job.steps.map((step: any) => {
          const key = `${job.id}.${step.name}`
          return <div key={key} id={key}>
            <h3>{step.name}</h3>
            <div>
              {step.documentation.map((doc: any) => {
                const key = `${job.id}.${step.name}.${doc.contentID}`
                return <div key={key} id={key}>
                  <h5>- {doc.contentID}</h5>
                </div>
               })}
            </div>
          </div>
         })}
      </div>
    </div>
  )
}
