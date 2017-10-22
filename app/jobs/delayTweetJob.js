const NR = require("node-resque")
const WebSocket = require('ws');

const DELAY = 1
const queueName = 'tweet'
const TAG = 'DelayTweetJob'

/*
 * ConnectionDetails
 */
const connectionDetails = __config.resque.connectionDetails

/*
 * Worker WebSocket
 */
const ws = new WebSocket('ws://127.0.0.1:8080/worker')

ws.on('message', function incoming(data) {
  console.log(data)
})

/*
 * Jobs
 */
const jobs = {
  "tweet": {
    plugins: [ 'retry' ],
    pluginOptions: {
      retry: {
        retryLimit: 1
      }
    },
    perform: function(uuid, tweet, callback) {
      console.log('------')
      console.log(uuid)
      console.log('------')
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
const queue = new NR.queue({ connection: connectionDetails }, jobs)
var connected = false

exports.connectQueue = function () {
  queue.connect(function() {
    connected = true
  })
}

exports.enqueueTweet = function (uuid, tweet) {
  if (connected) {
    console.log("[%s] %s", TAG, `enqueue -- ${uuid} ${tweet.text}`)
    queue.enqueueIn(DELAY, queueName, 'tweet', [uuid, tweet])
  }
}

/*
 * Worker
 */
exports.startWorker = function () {
  const worker = new NR.worker({connection: connectionDetails, queues: [queueName]}, jobs)
  worker.on('start',           function(){ console.log("worker started") })
  worker.on('end',             function(){ console.log("worker ended") })
  worker.on('cleaning_worker', function(worker, pid){ console.log("cleaning old worker " + worker) })
  worker.on('poll',            function(queue){ console.log("worker polling " + queue) })
  worker.on('job',             function(queue, job){ console.log("working job " + queue + " " + JSON.stringify(job)) })
  worker.on('reEnqueue',       function(queue, job, plugin){ console.log("reEnqueue job (" + plugin + ") " + queue + " " + JSON.stringify(job)) })
  worker.on('success',         function(queue, job, result){ console.log("job success " + queue + " " + JSON.stringify(job) + " >> " + result) })
  worker.on('failure',         function(queue, job, failure){ console.log("job failure " + queue + " " + JSON.stringify(job) + " >> " + failure) })
  worker.on('error',           function(queue, job, error){ console.log("error " + queue + " " + JSON.stringify(job) + " >> " + error) })
  worker.on('pause',           function(){ console.log("worker paused"); });

  worker.connect(function () {
    // worker.workerCleanup() // optional: cleanup any previous improperly shutdown workers on this host
    worker.start()
  })
}

/*
 * Scheduler
 */
exports.startScheduler = function () {
  var scheduler = new NR.scheduler({connection: connectionDetails});
  scheduler.on('start',             function(){ console.log("scheduler started"); });
  scheduler.on('end',               function(){ console.log("scheduler ended"); });
  scheduler.on('poll',              function(){ console.log("scheduler polling"); });
  scheduler.on('master',            function(state){ console.log("scheduler became master"); });
  scheduler.on('error',             function(error){ console.log("scheduler error >> " + error); });
  scheduler.on('working_timestamp', function(timestamp){ console.log("scheduler working timestamp " + timestamp); });
  scheduler.on('transferred_job',   function(timestamp, job){ console.log("scheduler enquing job " + timestamp + " >> " + JSON.stringify(job)); });

  scheduler.connect(function(){
    scheduler.start()
  })
}
