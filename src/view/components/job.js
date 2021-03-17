const { app, eph } = require('~/src/app')
const { getJob } = require('~/src/actions/job')

const log = require('~/src/logger').logger('components/job')

module.exports.Job = Job

function drawJob(job) {
  return `${job.id} | ${job.createdAt} | ${job.owner}`
}

function Job(jobId) {
  log.debug('Job - rendering', { jobId })

  // initialize
  getJob({ app }, jobId)

  // get what you need
  const subscription = eph().jobs.findOne().where('id').equals(jobId).$.subscribe(
    (job) => {
      if (job) {
        log.debug('Job - got job', { job })
        eph().display.insert({ key: jobId, parentId: jobId, content: drawJob(job) })
      }
    }
  )

  return () => {
    log.debug('Job - cleaning up', { jobId })
    eph().display.find().where('parentId').equals(jobId).remove()
    subscription.unsubscribe()
  }
}