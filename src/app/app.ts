/**
  @example usage:
    ```javascript
    import { app } from '~/src/app'
    import { stripGqlFields } from '~/src/util/gql'

    const { gqlClients, eph } = app()

    const id = 'job-...-some-uuid'
    const resp = await gqlClients.jobs.query(GetJob, { id }).toPromise()
    const { job } = resp.data.getJob
    await eph().jobs.insert(stripGqlFields(job))
    ```
 */
import { RxDatabase } from 'rxdb'
import { Client } from '@urql/core'

interface App {
  gqlClients: {
    jobs: Client,
    content: Client,
  },
  db: () => RxDatabase<any>,
  eph: () => RxDatabase<any>,
}

let _app: App | null = null
// let _db: RxDatabase<any> = null
// let _eph: RxDatabase<any> = null

export function app() {
  if (!_app) {
    throw new Error('app has not been inited! go do that!')
  }
  return _app
}

// export function db() {
//   if (!_db) {
//     throw new Error('db has not been created!')
//   }
//   return _db
// }
//
// export function eph() {
//   if (!_eph) {
//     throw new Error('ephemeral db has not been created!')
//   }
//   return _eph
// }

export function globalize(__app: App) {
  // store these things privately in memory; external consumers can use the
  // thunks below to access them
  // _db = __app.db
  // _eph = __app.eph
  // overwrite the app() values for .db and .eph with the thunked versions
  // rather than the instances
  // _app = { ...__app, db, eph }
  _app = __app
}
