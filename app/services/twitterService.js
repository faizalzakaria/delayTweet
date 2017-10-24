const TAG = 'TWITTERSERVICE'

const logger = require(__basedir + '/app/services/logger')
const Twit = require('twit')

const locationBoxDelta = __config.app.locationBoxDelta
const streams = {}

const client = new Twit(__config.twitter)

exports.filterTweets = function (uuid, location, callback) {
  const locations = [
    `${location.lng - locationBoxDelta}`,
    `${location.lat - locationBoxDelta}`,
    `${location.lng + locationBoxDelta}`,
    `${location.lat + locationBoxDelta}`
  ]

  logger.log(TAG, 'Starting Tweets stream for ' + uuid + locations)

  const stream = client.stream('statuses/filter', { locations: locations })
  stream.on('tweet', function (tweet) {
    if (tweet) {
      logger.log(TAG, uuid + ':' + tweet.text)

      if (callback) { callback(tweet) }
    }
  })
  streams[uuid] = stream
}

exports.stopStream = function (uuid) {
  const stream = streams[uuid]
  if (stream) {
    stream.stop()
    logger.log(TAG, 'Stream stopped for ' + uuid)
  }
}
