const http = require('http')

var options = {
  host: '127.0.0.1',
  port: 3000,
  path: '/websockets',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}

const tweetsDiv = document.createElement('div')
document.body.appendChild(tweetsDiv)

const printText = function (text) {
  const hrNode = document.createElement('hr')
  const pNode = document.createElement('p')
  const textNode = document.createTextNode(text)
  pNode.appendChild(textNode)
  tweetsDiv.appendChild(pNode)
  tweetsDiv.appendChild(hrNode)
}

const req = http.request(options, function (res) {
  res.setEncoding('utf8')

  res.on('data', function (data) {
    const { wsUrl } = JSON.parse(data)

    const ws = new WebSocket(wsUrl)

    ws.onmessage = function (m) {
      printText(m.data)
      console.log(m.data)
    }
  })
})

req.on('error', function (e) {
  console.log('problem with request: ' + e.message)
})

const location = { lat: 52.52, lng: 13.405 }

req.write(JSON.stringify(location))
req.end()
