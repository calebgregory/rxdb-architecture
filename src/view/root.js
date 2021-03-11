const { vorpal } = require('./renderer')

require('./job')
require('./job-list')

/*
vorpal.command('list job_contents <job_id>', 'list content on a job')
  .action(function(args, cb) {
    this.log(args)
    cb()
  })
*/

vorpal.delimiter("(>'')>").show()

const { eph } = require('~/src/db')

eph().view.$.subscribe((val) => {
  vorpal.ui.redraw(val)
  vorpal.ui.redraw.done();
})
