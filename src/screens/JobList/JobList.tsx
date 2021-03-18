import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useObservableState } from 'observable-hooks'
import { app } from '~/src/app'
import { listJobs } from '~/src/actions/jobs/list'

function getJobTitle(job: { [key: string]: any }): string {
  return `${job.workOrderNumber} - ${job.customerName} - ${job.jobLocation}`
}

export function JobList() {
  useEffect(() => { listJobs() }, [])

  const jobs: any = useObservableState(app().eph().jobs.find().$, [])

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
