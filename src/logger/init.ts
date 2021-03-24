import debug from 'debug'

const log = debug('logger')

export function init() {
  let logConfig = '*'
  try {
    logConfig = require('~/LOGCONFIG')
  } catch (_err) {
    log(`you have not configured any LOGCONFIG.js. if you wish, you can turn
    log namespaces and levels on/off by creating a file
    <repo-root>/LOGCONFIG.js and putting in it a 'debug'-formatted LOGCONFIG.
    see LOGCONFIG.example.js for inspiration.`)
  }
  debug.enable(parseLogConfig(logConfig))
}

export function parseLogConfig(lc: string): string {
  return lc.replace(/[ ,]/g, '').split(/\n/).filter(Boolean).join(',')
}
