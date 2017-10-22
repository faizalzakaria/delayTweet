const WebSocket = require('ws')
var ws = null

const TAG = 'workerWebSocket'

exports.start = function () {
  ws = new WebSocket('ws://127.0.0.1:8080/worker')
}

exports.sendMsg = function (uuid, msg) {
  const payload = { targetUuid: uuid, msg: msg }
  console.log("[%s] %s", TAG, `payload ${uuid} - ${msg}`)
  ws.send(JSON.stringify(payload))
}
