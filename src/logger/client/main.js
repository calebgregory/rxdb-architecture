console.log('hello')
const ws = new WebSocket('ws://localhost:3000')

ws.onopen = () => {
  console.log('[open] Connection established')
}

ws.onmessage = (event) => {
  console.log(...JSON.parse(event.data))
}
