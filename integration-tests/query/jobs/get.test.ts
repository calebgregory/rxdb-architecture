import { init, destroy } from '~/integration-tests/test-app'
import { app, globalize } from '~/src/app'
import { getJob } from '~/src/query/jobs/get'
import { CreateJob } from '~/src/mutation/jobs/create'
import { id as gid } from '~/src/util/testing'
import credentials from '~/integration-tests/test-credentials.json'

describe('getJob', () => {
  beforeAll((done) => {
    init().then(globalize).then(done)
  })

  afterAll((done) => {
    destroy().then(done)
  })

  it('fetches and stores a job', async () => {
    expect.assertions(2)

    const { gqlClients, eph } = app()

    const id = gid('job')
    const now = new Date().toISOString()
    const newJob = { createdAt: now, updatedAt: now }
    await gqlClients.jobs.query(CreateJob, { input: { id, newJob } }).toPromise()

    await getJob(id)

    const job = await eph().jobs.findOne({ selector: { id } }).exec()
    expect(job).not.toBeNull()
    expect(job.owner).toEqual(credentials.username)
  })
})
