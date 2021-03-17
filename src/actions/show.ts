const { app } = require('~/src/app')
const log = require('~/src/logger').logger('actions/show')

export async function show(kind: string, id: string) {
  const { eph } = app()
  const item = { kind, id }
  const shown = await eph().view.findOne({ selector: item }).exec()
  log.debug('show - received command to show item', { item, shown })

  if (!shown) {
    await eph().view.insert(item)
  }
}

export async function hide(kind: string, id: string) {
  const { eph } = app()
  await eph().view.findOne({ selector: { kind, id } }).remove()
}