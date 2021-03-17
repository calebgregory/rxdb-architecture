import debug from 'debug'

debug.enable('*')

const LEVELS = ['info', 'debug', 'trace', 'warning', 'error']

export function logger(namespace: string) {
  return LEVELS.reduce((acc: { [key: string]: any }, level) => {
    // apparently you cannot just log nothing, so we spread the rest after head
    acc[level] = (x: any, ...xs: any[]) => debug(`${namespace}:${level}`)(x, ...xs)
    return acc
  }, {})
}