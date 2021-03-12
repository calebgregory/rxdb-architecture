const { vorpal } = require('./renderer')

require('./job')
require('./job-list')

vorpal.delimiter("(>'')>").show()

const { eph } = require('~/src/db')

// @todo
eph().view.$.subscribe((val) => {
  vorpal.ui.redraw(val)
  vorpal.ui.redraw.done();
})
