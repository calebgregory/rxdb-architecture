debug.enable('*')

const log = debug('[ws]')

const makeWS = () => new WebSocket('ws://localhost:3000')

main(makeWS(), 0, 1).then(_do => {/* nothing */}).catch(_me => {/* if ye can */})

function main(ws, m, n, timeoutId) {
  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      log('Connection established')
      m = 0; n = 1
      clearTimeout(timeoutId)
      resolve(true)
    }

    ws.onmessage = (event) => {
      const [namespace, level, args] = JSON.parse(event.data)
      debug(namespace+':'+level)(...args)
    }

    ws.onerror = (event) => {
      reject(false)
    }

    ws.onclose = (event) => {
      switch(event.code) {
        case 1000:
        case 1001:
          debug('Websocket connection closed.')
          return

        default:
          attemptReconnect()
      }
    }
  })
}

function attemptReconnect(m, n) {
  const noise = Math.floor(Math.random() * 50)
  const hold = Math.log((m + n) + noise) // seconds
  const timeoutId = setTimeout(() => {
    log(`Attempting to reconnect; will try again in ~${hold.toPrecision(6)} seconds...`)
    main(makeWS(), n, m + n, timeoutId).catch()
  }, hold * 1000)
}
