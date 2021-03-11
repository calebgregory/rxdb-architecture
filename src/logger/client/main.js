debug.enable('*')

const ws = new WebSocket('ws://localhost:3000')

ws.onopen = () => {
  debug('[ws]')('Connection established')
}

ws.onmessage = (event) => {
  const [namespace, level, args] = JSON.parse(event.data)
  debug(namespace+':'+level)(...args)
}
