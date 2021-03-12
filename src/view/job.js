const { vorpal } = require('./renderer')
const { app } = require('~/src/app')
const { getJob } = require('~/src/actions/job')
const { listJobs } = require('~/src/actions/job')
const { show } = require('~/src/actions/show')

vorpal.command('show job <job_id>', 'show a job')
  .action(async function(args, cb) {
    await getJob({ app }, args.job_id)
    await show({ app }, 'jobs', args.job_id)
    cb()
  })

// @todo
vorpal.command('show jobs list', 'list jobs that belong to you')
  .action(async function(_args, cb) {
    await listJobs()
    cb()
  })