const path = require('path')
const express = require('express')
const ws = require('ws')

const app = express()

const pathToClient = path.resolve(__dirname, './client')
app.use('/', express.static(pathToClient, { extensions: ['html', 'js'] }))

// Set up a headless websocket server
const wss = new ws.Server({ noServer: true })

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(3000)
server.on('upgrade', (request, socket, head) => {
  console.log('[debug] logging websocket connection established')
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request)
  })
})

function log(...message) {
  wss.clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}

setTimeout(() => {
  log('this', { is: 'a test' })
}, 10000)