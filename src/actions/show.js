const log = require('~/src/logger').logger('actions/show')

module.exports.show = async function show({ app }, kind, id) {
  const { eph } = app()
  const item = { kind, id }
  const shown = await eph().view.findOne({ selector: item }).exec()
  log.debug('show - received command to show item', { item, shown })

  if (!shown) {
    await eph().view.insert(item)
  }
}

module.exports.hide = async function hide({ app }, kind, id) {
  const { eph } = app()
  await eph().view.findOne({ selector: { kind, id } }).remove()
}