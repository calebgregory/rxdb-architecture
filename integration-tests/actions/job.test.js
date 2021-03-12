const { eph } = require('~/src/db')
const { init } = require('~/src/init')
const { getJob } = require('~/src/actions/job')

require('~/src/logger/server.js')

let app
async function setup() {
  if (app) {
    return () => app
  }
  app = await init()
  return () => app
}

describe('getJob', () => {
  it('fetches and stores a job', async () => {
    expect.assertions(1)

    const app = await setup()

    const jobId = "job-29cebec6-7a7a-i144-1a9d4ed3a691-u7BD-9b3b53b43b4f"
    await getJob({ app, eph }, jobId)
    const job = await eph().jobs.findOne({ selector: { id: jobId } })
    expect(job).not.toBeNull()
  })
})