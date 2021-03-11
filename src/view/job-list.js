const { vorpal } = require('./renderer')
const { listJobs } = require('~/src/actions/job')

vorpal.command('show jobs list', 'list jobs that belong to you')
  .action(async function(_args, cb) {
    await listJobs()
    cb()
  })
