const WebSocket = require('ws')

const uuid = process.argv[2]

const ws = new WebSocket('ws://127.0.0.1:8080/worker')

ws.on('open', function open () {
  const payload = { uuid: uuid, msg: 'Hello Hello' }
  ws.send(JSON.stringify(payload))
})

ws.on('message', function incoming (data) {
  console.log(data)
})
