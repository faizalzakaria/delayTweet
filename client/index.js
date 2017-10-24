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

/* https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript */
const getParameterByName = function (name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
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

const lat = getParameterByName('lat') || 52.52
const lng = getParameterByName('lng') || 13.405
const location = { lat: lat, lng: lng }

req.write(JSON.stringify(location))
req.end()
