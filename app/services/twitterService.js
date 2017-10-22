const Twit = require('twit');

const locationBoxDelta = 5
const streams = {}

const client = new Twit(__config.twitter)

exports.filterTweets = function(uuid, location, callback) {
  const locations = [
    `${location.lng - locationBoxDelta}`,
    `${location.lat - locationBoxDelta}`,
    `${location.lng + locationBoxDelta}`,
    `${location.lat + locationBoxDelta}`
  ]

  console.log(locations)
  const stream = client.stream("statuses/filter", { locations: locations })
  stream.on('tweet', function(tweet) {
    if (tweet) {
      console.log(uuid, ':', tweet.text)

      if (callback)
        callback(tweet)
    }
  })
  streams[uuid] = stream
}

exports.stopAllStreams = function () {
  streams.keys.forEach (function(uuid) {
    streams[uuid].stop()
    console.log('Stopped ...')
  })
}

exports.stopStream = function (uuid) {
  const stream = streams[uuid]
  if (stream) {
    stream.stop()
    console.log("Stopped stream", uuid)
  }
}
