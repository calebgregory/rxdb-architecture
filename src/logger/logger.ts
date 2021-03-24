import debug from 'debug'

const log = debug('logger')

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
const LEVELS = ['info', 'debug', 'trace', 'warning', 'error']

export function logger(namespace: string) {
  return LEVELS.reduce((acc: { [key: string]: any }, level) => {
    // apparently you cannot just log nothing, so we spread the rest after head
    acc[level] = (x: any, ...xs: any[]) => debug(`${namespace}:${level}`)(x, ...xs)
    return acc
  }, {})
}

export function parseLogConfig(lc: string): string {
  return lc.replace(/[ ,]/g, '').split(/\n/).filter(Boolean).join(',')
}
