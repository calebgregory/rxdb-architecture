module.exports.app = app
module.exports.db = db
module.exports.eph = eph

let _app = null
let _db = null
let _eph = null

function app() {
  if (!_app) {
    throw new Error('app has not been inited! go do that!')
  }
  return _app
}

function db() {
  if (!_db) {
    throw new Error('db has not been created!')
  }
  return _db
}

function eph() {
  if (!_eph) {
    throw new Error('ephemeral db has not been created!')
  }
  return _eph
}

module.exports.makeAccessible = (__app) => {
  // store these things privately in memory; external consumers can use the
  // thunks below to access them
  _db = __app.db
  _eph = __app.eph
  // overwrite the app() values for .db and .eph with the thunked versions
  // rather than the instances
  _app = { ...__app, db, eph }
}