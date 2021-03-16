const keys = require('ramda/src/keys')
const pipe = require('ramda/src/pipe')
const reduce = require('ramda/src/reduce')
const toPairs = require('ramda/src/toPairs')

module.exports.formatForLog = formatForLog

function formatForLog(_cleanupRegistry) {
  return pipe(
    toPairs,
    reduce((acc, [kind, cleanupById]) => {
      acc[kind] = keys(cleanupById)
      return acc
    }, {})
  )(_cleanupRegistry)
}