let _app = null

module.exports.makeAccessible = (__app) => {
  _app = __app
}

module.exports.app = function app() {
  if (!_app) {
    throw new Error('app has not been inited! go do that!')
  }
  return _app
}