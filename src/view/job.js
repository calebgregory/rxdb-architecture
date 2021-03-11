const { vorpal } = require('./renderer')
const { getJob, showJob } = require('~/src/actions/job')

vorpal.command('show job <job_id>', 'show a job')
  .action(async function(args, cb) {
    await getJob(args.job_id)
    await showJob()
    cb()
  })
