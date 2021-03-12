const { vorpal } = require('./renderer')
const { batchedQueryByKind } = require('~/src/util/rxjs/operators')

const log = require('~/src/logger').logger('view/root')

require('./job')

vorpal.delimiter("(>'')>").show()

const { eph } = require('~/src/db')

const show$ = eph().view.find().$

const collectionsByKind = {
  jobs: () => eph().jobs
}

const thingsToShow$ = show$.pipe(
  batchedQueryByKind(
    (kind, ids) => collectionsByKind[kind]().find().where('id').in(ids).$
  )
)

thingsToShow$.subscribe(([kind, item]) => {
  log.debug('got things to show', { kind, item })
  vorpal.ui.redraw(JSON.stringify(item))
  vorpal.ui.redraw.done();
})
