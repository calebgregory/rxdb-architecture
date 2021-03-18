import React, { useEffect } from 'react'
import { listJobs } from '~/src/actions/jobs/list'

export function JobList() {
  useEffect(() => { listJobs() }, [])

  return <div>list of jobs</div>
}
