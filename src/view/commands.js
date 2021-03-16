const { vorpal } = require('./renderer')
const { app } = require('~/src/app')
const { listJobs } = require('~/src/actions/job')
const { show, hide } = require('~/src/actions/show')

vorpal.command('show job <job_id>', 'show a job')
  .action(function(args, cb) {
    show({ app }, 'jobs', args.job_id).then(() => cb())
  })

vorpal.command('hide job <job_id>', 'hide a job')
  .action(function(args, cb) {
    hide({ app }, 'jobs', args.job_id).then(() => cb())
  })

// @todo
vorpal.command('show jobs list', 'list jobs that belong to you')
  .action(function(_args, cb) {
    listJobs().then(() => cb())
  })

// @todo
vorpal.command('show content <content_id>', 'show a content')
  .action(function(args, cb) {
    this.log(args)
    cb()
  })