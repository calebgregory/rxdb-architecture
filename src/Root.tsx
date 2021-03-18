import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  // Link
} from "react-router-dom"
import { JobList } from '~/src/screens/JobList'
import { Job } from '~/src/screens/Job'

export function Root() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/jobs" />
        </Route>
        <Route path='/jobs' component={JobList} />
        <Route path='/jobs/:id' component={Job} />
      </Switch>
    </Router>
  )
}
