module.exports.show = async function show({ eph }, kind, id) {
  const item = { kind, id }
  const shown = await eph().view.findOne({ selector: item })
  if (!shown) {
    await eph().view.insert(item)
  }
}

module.exports.hide = async function hide({ eph }, kind, id) {
  await eph().view.findOne({ selector: { kind, id } }).remove()
}