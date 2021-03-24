const path = require('path')
const debug = require('debug')
const { parseLogConfig } = require('~/src/logger/init')

const log = debug('jest.setup.js')

const LOGCONFIG_HINT_MSG = `you have not configured any LOGCONFIG.js. as a
result of this, you're going to have quite verbose logs in your tests. if you
wish, you can turn log namespaces and levels on/off by creating a file
<repo-root>/integration-tests/LOGCONFIG.js and putting in it a
'debug'-formatted LOGCONFIG. see LOGCONFIG.example.js for
inspiration.`.replace('\n', ' ')

let logConfig = '*'
try { // integration-test logconfig
  logConfig = require(path.resolve(__dirname, './LOGCONFIG.js'))
} catch (_err) {
  try { // falling back to app logconfig
    logConfig = require(path.resolve(__dirname, '../LOGCONFIG.js'))
  } catch (_err) {
    log(LOGCONFIG_HINT_MSG)
  }
}
debug.enable(parseLogConfig(logConfig))

// integration tests take longer to run
jest.setTimeout(10000)
