import React, { SyntheticEvent, useState } from 'react'
import { useHistory } from "react-router-dom"
import { createJob } from '~/src/mutation/jobs/create'
import { id as gid } from '~/src/util/testing'

export function JobCreate() {
  const history = useHistory()
  const [customerName, setCustomerName] = useState('')
  const [jobLocation, setJobLocation] = useState('')
  const [workOrderNumber, setWorkOrderNumber] = useState('')

  const handleSubmit = (evt: SyntheticEvent<HTMLFormElement | HTMLButtonElement>) => {
    evt.preventDefault()
    const id = `job-${gid()}`
    const newJobInput = { customerName, jobLocation, workOrderNumber }
    createJob(id, newJobInput)
    history.push(`/jobs/${id}`)
  }

  return <div>
    <form onSubmit={handleSubmit}>
      <input type='text'
        value={customerName}
        onChange={evt => { setCustomerName(evt.target.value) }}
        placeholder='Customer Name'
      />
      <br/>
      <input type='text'
        value={jobLocation}
        onChange={evt => { setJobLocation(evt.target.value) }}
        placeholder='Job Location'
      />
      <br/>
      <input type='text'
        value={workOrderNumber}
        onChange={evt => { setWorkOrderNumber(evt.target.value) }}
        placeholder='Work Order Number'
      />
      <br/>
      <button onClick={handleSubmit}>Create Job</button>
    </form>
  </div>
}
