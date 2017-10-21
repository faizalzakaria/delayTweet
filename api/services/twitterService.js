'use strict'

const Twit = require('twit');

const locationBoxDelta = 5
const streams = {}

const client = new Twit({
  consumer_key: 'GBE5IyAQZxt5sF7OfVcjA',
  consumer_secret: 'APoTr51sLLvDnIKtLaOUPv2yu5bx0RVjAbSV61KDT8',
  access_token: '165003539-kperMEDinOCvZJb18ypjL7JZ3eBSwONH8lD3BIzA',
  access_token_secret: 'oXDBkTVVJTbds0iHKKnTtXWKOaXitkonsxOtTc61kM'
})

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
  streams[uuid].stop()
  console.log("Stopped stream", uuid)
}
