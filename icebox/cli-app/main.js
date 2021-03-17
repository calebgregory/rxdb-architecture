const { init } = require('~/src/init')
const { makeAccessible } = require('~/src/app')

async function main() {
  const app = await init()
  makeAccessible(app)

  require('~/src/view/root')
  require('~/src/logger/server.js')
}

main()
