# src/app/

## Usage

### Application logic

```javascript
// src/query/jobs/get.ts

import { app } from '~/src/app'
import { stripGqlFields } from '~/src/util/gql'

const { gqlClients, eph } = app()

export function getJob(id: string) {
  const resp = await gqlClients.jobs.query(GetJob, { id }).toPromise()
  const { job } = resp.data.getJob
  await eph().jobs.insert(stripGqlFields(job))
}
```

### View Component

```javascript
// src/screens/Job/Job.ts

import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useObservableState } from 'observable-hooks'
import { app } from '~/src/app'
import { data } from '~/src/util/rxdb/operators'
import { getJob } from '~/src/query/jobs/get'
import { Job as JobT, User } from '~/src/gql/types/jobs'

type Params = {
  id: string
}

function getOwnerName({ family_name, given_name }: User): string {
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
    <div>{getOwnerName(job.owner_info)} owns this job</div>
  )
}
```

The `app` is a singleton instance that contains application components that code written in a given file may depend on to

a. fetch data
b. access cached data
c. observe changes on

At the moment, it contains

- a collection of network-only GraphQL clients
- a persistent store
- an ephemeral store

but its contents will expand as the needs for the application require.

In general, we want a reactive architecture.  Any fundamental components you're writing should be either reacting to observed values or putting values into a stream of values that something else can react to.

A beautiful thing about RxDB is that it affords consumers the ability to observe any changes to the database.  So, modifying a document in a database collection in any way is equivalent to 'putting a value in a stream of values that something else can react to.'

The `app` singleton and its contents are globally available.  They can be used simply by importing the `app()` thunk from `~/src/app` and pulling whatever you need off of it.

This is an alternative to storing these things within the React component hierarchy (as you may have seen done using `React.Context`).  Doing so is an anti-pattern, because it constrains consumers of these instances or the data therein to be 'located' inside of a React component, which in turn requires whatever code you're writing to be tested and developed within a React app, which comes with it the complexities of the React library or the React Native framework (the most basic complexity of which is "must be rendered").  A particularly gutwrenching form of resistance to development is when you have some software you want to write in Javascript but have to spend hours or days debugging the build system to even get started.  We want to avoid taking on the complexity of React and React Native as much as possible.

## `app()` thunk

It's good to wrap the `app` instance in a thunk `app()` because there is a time in the application's life at which `app` has not been instantiated.  If a consumer calls `app()` at that time, they'll have an error thrown to them.

## `gqlClients`

It is significant that these are `'network-only'` GraphQL clients.  Many GraphQL clients (including the one we use in this sample application, `urql`) take care of caching for you.  A data cache is an application-level concern, and we do not want to defer the implementation of cache manipulation to a library.  This is a trade off of ease for simplicity.

## `db()`, `eph()`

See [the `db` docs](../db/)
