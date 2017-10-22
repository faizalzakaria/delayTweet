const TAG = 'DELAYTWEETJOB'
const logger = require(__basedir + '/app/services/logger')

const NR = require('node-resque')
const WebSocket = require('ws')

const DELAY = __config.app.tweetDelay
const QUEUENAME = 'tweet'

/*
 * ConnectionDetails
 */
const connectionDetails = __config.resque.connectionDetails

/*
 * Worker WebSocket
 */
const wsUrl = `ws://${__config.websocket.host}:${__config.websocket.port}/worker`
const ws = new WebSocket(wsUrl)

/*
 * Jobs
 */
const jobs = {
  'tweet': {
    plugins: [ 'retry' ],
    pluginOptions: {
      retry: {
        retryLimit: 1
      }
    },
    perform: function (uuid, tweet, callback) {
      const payload = { targetUuid: uuid, msg: tweet.text }
      ws.send(JSON.stringify(payload))

      // NOTE: Bummer!
      // This method is very important, or the next job won't get executed
      callback(null, uuid)
    }
  }
}

/*
 * Queue
 */
const queue = new NR.queue({ connection: connectionDetails }, jobs) // eslint-disable-line
var connected = false

exports.connectQueue = function () {
  queue.connect(function () {
    connected = true
  })
}

exports.enqueueTweet = function (uuid, tweet) {
  if (connected) {
    if (DELAY > 0) {
      queue.enqueueIn(DELAY, QUEUENAME, 'tweet', [uuid, tweet])
    } else {
      queue.enqueue(QUEUENAME, 'tweet', [uuid, tweet])
    }
    logger.log(TAG, `enqueued -- ${uuid} ${tweet.text}`)
  }
}

/*
 * Worker
 */
exports.startWorker = function () {
  const worker = new NR.worker({connection: connectionDetails, queues: [QUEUENAME]}, jobs)  // eslint-disable-line
  worker.on('start', function () { logger.log(TAG, 'worker started') })
  worker.on('end', function () { logger.log(TAG, 'worker ended') })
  worker.on('cleaning_worker', function (worker, pid) { logger.log(TAG, 'cleaning old worker ' + worker) })
  worker.on('poll', function (queue) { logger.log(TAG, 'worker polling ' + queue) })
  worker.on('job', function (queue, job) { logger.log(TAG, 'working job ' + queue + ' ' + JSON.stringify(job)) })
  worker.on('reEnqueue', function (queue, job, plugin) { logger.log(TAG, 'reEnqueue job (' + plugin + ') ' + queue + ' ' + JSON.stringify(job)) })
  worker.on('success', function (queue, job, result) { logger.log(TAG, 'job success ' + queue + ' ' + JSON.stringify(job) + ' >> ' + result) })
  worker.on('failure', function (queue, job, failure) { logger.log(TAG, 'job failure ' + queue + ' ' + JSON.stringify(job) + ' >> ' + failure) })
  worker.on('error', function (queue, job, error) { logger.log(TAG, 'error ' + queue + ' ' + JSON.stringify(job) + ' >> ' + error) })
  worker.on('pause', function () { logger.log(TAG, 'worker paused') })

  worker.connect(function () {
    worker.workerCleanup()
    worker.start()
  })
}

/*
 * Scheduler
 */
exports.startScheduler = function () {
  var scheduler = new NR.scheduler({connection: connectionDetails})  // eslint-disable-line
  scheduler.on('start', function () { logger.log(TAG, 'scheduler started') })
  scheduler.on('end', function () { logger.log(TAG, 'scheduler ended') })
  scheduler.on('poll', function () { logger.log(TAG, 'scheduler polling') })
  scheduler.on('master', function (state) { logger.log(TAG, 'scheduler became master') })
  scheduler.on('error', function (error) { logger.log(TAG, 'scheduler error >> ' + error) })
  scheduler.on('working_timestamp', function (timestamp) { logger.log(TAG, 'scheduler working timestamp ' + timestamp) })
  scheduler.on('transferred_job', function (timestamp, job) { logger.log(TAG, 'scheduler enquing job ' + timestamp + ' >> ' + JSON.stringify(job)) })

  scheduler.connect(function () {
    scheduler.start()
  })
}
