require('./environment')

const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./config/routes')

const port = process.env.PORT || 3000
const app = express()

/*
 * Http server
 */

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

routes(app)
app.listen(port)

console.log('Server run on PORT', port)

/*
 * Jobs
 */
const delayTweetJob = require('./app/jobs/delayTweetJob')
delayTweetJob.connectQueue()

/*
 * Websocket
 */
const WebSocket = require('ws')
const twitterService = require('./app/services/twitterService')
const redisClient = require('./app/services/redis')

const wss = new WebSocket.Server({ port: __config.websocket.port })

var clients = {}

wss.on('connection', function connection (ws, req) {
  const uuid = req.url

  /* Worker */
  if (uuid && uuid !== '/worker') {
    redisClient.getRequest(uuid, function (location) {
      twitterService.filterTweets(uuid, location, function (tweet) {
        return delayTweetJob.enqueueTweet(uuid, tweet)
      })
    })
  }

  ws.on('message', function incoming (payload) {
    const { targetUuid, msg } = JSON.parse(payload)
    const client = clients[targetUuid]
    if (client) {
      console.log('sending: %s to %s', msg, targetUuid)
      client.send(msg)
    }
  })

  ws.on('close', function (close) {
    console.log(`Disconnected ${uuid}`)
    twitterService.stopStream(uuid)
  })

  ws.send(`Connected ${req.url}`)

  clients[uuid] = ws
})

/*
 * Worker & Scheduler (Optional)
 * Or you can run seperately
 */
if (process.env.RUN_JOBS) {
  delayTweetJob.startWorker()
  delayTweetJob.startScheduler()
}
