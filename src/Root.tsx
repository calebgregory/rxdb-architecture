import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import { Menu } from '~/src/components/Menu'
import { JobList } from '~/src/screens/JobList'
import { JobCreate } from '~/src/screens/JobCreate'
import { Job } from '~/src/screens/Job'

export function Root() {
  return (
    <Router>
      <Menu />
      <Switch>
        <Route exact path="/">
          <Redirect to="/jobs" />
        </Route>
        <Route path='/jobs/new' component={JobCreate} />
        <Route path='/jobs/:id' component={Job} />
        <Route path='/jobs' component={JobList} />
      </Switch>
    </Router>
  )
}
