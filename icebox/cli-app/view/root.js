const assocPath = require('ramda/src/assocPath')
const complement = require('ramda/src/complement')
const isEmpty = require('ramda/src/isEmpty')
const { filter } = require('rxjs/operators')
const { vorpal } = require('./renderer')
const { eph } = require('~/src/app')
const { Job } = require('~/src/view/components/job')

require('~/src/view/commands')

const log = require('~/src/logger').logger('view/root')

const componentByKind = {
  jobs: Job
}

let cleanupRegistry = {}
const { formatForLog } = require('~/src/util/view/cleanup-registry')
function registerCleanup(kind, id, cleanup) {
  cleanupRegistry = assocPath([kind, id], cleanup, cleanupRegistry)
  log.debug('registerCleanup - registered', { cleanupsRegisteredByKind: formatForLog(cleanupRegistry) })
}

function render(kind, id) {
  const component = componentByKind[kind]
  const cleanup = component(id)
  registerCleanup(kind, id, cleanup)
}

eph().view.find().$.pipe(filter(complement(isEmpty)))
  .subscribe((thingsToShow) => {
    vorpal.ui.redraw('hold on...')
    for (let i = 0; i < thingsToShow.length; i++) {
      const { kind, id } = thingsToShow[i]
      render(kind, id)
    }
  })

eph().view.remove$.subscribe((changeEvent) => {
  log.debug('removed from view collection', { changeEvent })
  const { documentData: { kind, id } } = changeEvent
  const cleanup = cleanupRegistry[kind][id]
  cleanup()
})

eph().display.find().sort({ key: 'desc' }).$.pipe(filter(complement(isEmpty)))
  .subscribe((rows) => {
    log.debug('got some rows to render', { rows })
    const frame = rows.map(r => r.content).join('\n')
    vorpal.ui.redraw(frame)
    vorpal.ui.redraw.done()
  })

vorpal.delimiter("(>'')>").show()