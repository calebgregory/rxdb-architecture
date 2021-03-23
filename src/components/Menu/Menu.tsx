import React from 'react'
import { Link } from 'react-router-dom'

export function Menu() {
  return (
    <ul>
      <li><Link to="/jobs">Jobs</Link></li>
      <li><Link to="/jobs/new">Create Job</Link></li>
    </ul>
  )
}
