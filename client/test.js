const WebSocket = require('ws')
const http = require('http')

var options = {
  host: '127.0.0.1',
  port: 3000,
  path: '/webSockets',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}

var req = http.request(options, function (res) {
  res.setEncoding('utf8')

  res.on('data', function (data) {
    const { wsUrl } = JSON.parse(data)
    const ws = new WebSocket(wsUrl)

    ws.on('message', function incoming (data) {
      console.log(data)
    })
  })
})

req.on('error', function (e) {
  console.log('problem with request: ' + e.message)
})

const location = { lat: 52.52, lng: 13.405 }

req.write(JSON.stringify(location))
req.end()
