const Rx = require('rxjs')

const log$ = new Rx.Subject()

module.exports.log$ = log$

const LEVELS = ['render', 'trace', 'debug', 'info', 'warning', 'error']

module.exports.logger = (namespace) => {
  return LEVELS.reduce((_logger, level) => {
    _logger[level] = (...args) => { log$.next([namespace, level, args]) }
    return _logger
  }, {})
}
