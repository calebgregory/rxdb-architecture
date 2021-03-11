const { vorpal } = require('./renderer')
const { getJob } = require('~/src/actions/get-job')

vorpal.command('show job <job_id>', 'show a job')
  .action(async function(args, cb) {
    await getJob(args.job_id)
    cb()
  })
