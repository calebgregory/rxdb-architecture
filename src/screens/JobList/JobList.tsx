import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useObservableState } from 'observable-hooks'
import { datas } from '~/src/util/rxdb/operators'
import { app } from '~/src/app'
import { listJobs } from '~/src/gql/operations/jobs/list'
import { getJobTitle } from '~/src/util/jobs'
import { Job } from '~/src/gql/types/jobs'

export function JobList() {
  useEffect(() => { listJobs() }, [])

  const jobs: ReadonlyArray<Job> = useObservableState(
    app().eph().jobs.find().$.pipe(datas()),
    []
  )

  return <div>
    <h1>Jobs</h1>
    <ul>
    {jobs.map((job: any) => (
      <li id={job.id} key={job.id}>
        <Link to={`/jobs/${job.id}`}>
          <span role="img" aria-label="click here">👉 {getJobTitle(job)}</span>
        </Link>
      </li>
    ))}
    </ul>
  </div>
}
