import { App } from './types'

let _app: App | null = null

export function app() {
  if (!_app) {
    throw new Error('app has not been inited! go do that!')
  }
  return _app
}

export function globalize(__app: App) {
  // store privately in memory; external consumers can use the
  // thunk above to access
  _app = __app
}

export function destroy() {
  _app = null
}
