const { vorpal } = require('./renderer')
const { eph } = require('~/src/app')
const { batchQueryByKind } = require('~/src/util/rxjs/operators')

const log = require('~/src/logger').logger('view/root')

require('./job')

vorpal.delimiter("(>'')>").show()

const collectionsByKind = {
  jobs: () => eph().jobs
}
function getCollectionByKind(kind) {
  const collection = collectionsByKind[kind]
  if (!collection) {
    throw new Error(`No collection configured for kind {${kind}}!`)
  }
  return collection()
}

const thingsToShow$ = eph().view.find().$.pipe(
  batchQueryByKind(
    (kind, ids) => getCollectionByKind(kind).find().where('id').in(ids).$
  )
)

function drawJob(job) {
  return `${job.id} | ${job.createdAt} | ${job.owner}`
}

const drawerByKind = {
  jobs: (items) => [ 'jobs', ...items.map(drawJob) ].join('\n'),
}

function draw(itemsByKind) {
  return Object.entries(itemsByKind)
    .map(([kind, items]) => drawerByKind[kind](items))
    .join('\n---\n')
}

thingsToShow$.subscribe((itemsByKind) => {
  log.debug('got things to show', { itemsByKind })
  vorpal.ui.redraw(draw(itemsByKind))
  vorpal.ui.redraw.done();
})
