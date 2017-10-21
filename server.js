const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const routes = require('./api/routes/tweetRoutes')
const bodyParser = require('body-parser')
const twitterService = require('./api/services/twitterService')
const redisClient = require('./api/services/redis')
const resqueClient = require('./api/services/resque')

/*
 * Http server
 */

app.use(bodyParser.json())

routes(app)
app.listen(port)

console.log("Server run on PORT", port)

/*
 * Websocket
 */
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

var clients = {}

wss.on('connection', function connection(ws, req) {
  const uuid = req.url

  /* Worker */
  if (uuid && uuid != '/worker') {
    redisClient.getRequest(uuid, function (location) {
      twitterService.filterTweets(uuid, location, function (tweet) {
        return resqueClient.enqueueTweet(uuid, tweet)
      })
    })
  }

  ws.on('message', function incoming(payload) {

    const { targetUuid, msg } = JSON.parse(payload)
    const client = clients[targetUuid]

    if (client) {
      console.log('sending: %s to %s', msg, targetUuid);
      client.send(msg)
    }
  })

  ws.on('close', function(close) {
    console.log(`Disconnected ${uuid}`)
    twitterService.stopStream(uuid)
  })

  ws.send(`Connected ${req.url}`);

  clients[uuid] = ws
})
