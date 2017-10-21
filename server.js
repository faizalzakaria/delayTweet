const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const routes = require('./api/routes/tweetRoutes')
const bodyParser = require('body-parser')
const twitterService = require('./api/services/twitterService')

/*
 * Http server
 */

app.use(bodyParser.json())

routes(app)
app.listen(port)

console.log("Server run on PORT", port)

/*
 * Twitter stream
 */
const location = { lat: 52.530844, lng: 13.3868664 }
twitterService.filterTweets(location)

/*
 * Websocket
 */
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

var clients = {}

wss.on('connection', function connection(ws, req) {
  twitterService.stopAllStreams()
  ws.on('message', function incoming(payload) {
    console.log('received: %s', payload);

    const { uuid, msg } = JSON.parse(payload)
    const client = clients[uuid]

    if (client) {
      client.send(msg)
    }
  });

  ws.on('close', function(close) {
    console.log(`Disconnected ${req.url}`)
  })

  ws.send(`Connected ${req.url}`);

  clients[req.url] = ws
})


/* Twitter stream here */

