const NR = require("node-resque")
const delay = 1
const queueName = 'tweet'

const connectionDetails = {
  pkg:       'ioredis',
  host:      '127.0.0.1',
  password:  null,
  port:      6379,
  database:  0,
  namespace: 'resque'
}

/*
 * Jobs / Workers
 */
const jobs = {
  "tweet": {
    plugins: [ 'jobLock', 'retry' ],
    pluginOptions: {
      jobLock: {},
      retry: {
        retryLimit: 1
      }
    },
    perform: function(uuid, tweet) {
      // todo
      console.log('------')
      console.log(uuid)
      console.log(tweet.text)
      console.log('------')
    }
  }
}

const queue = new NR.queue({ connection: connectionDetails }, jobs)

var connected = false

queue.connect(function() {
  connected = true
})

exports.enqueueTweet = function (uuid, tweet) {
  console.log("-- enqueue --", uuid, tweet.text)
  if (connected) {
    queue.enqueueIn(delay, queueName, 'tweet', [uuid, tweet])
    // queue.enqueue(queueName, 'tweet', [uuid, tweet])
  }
}
