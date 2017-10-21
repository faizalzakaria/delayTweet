'use strict'

const Twit = require('twit');

const locationBoxDelta = 5
const streams = []

const client = new Twit({
  consumer_key: 'GBE5IyAQZxt5sF7OfVcjA',
  consumer_secret: 'APoTr51sLLvDnIKtLaOUPv2yu5bx0RVjAbSV61KDT8',
  access_token: '165003539-kperMEDinOCvZJb18ypjL7JZ3eBSwONH8lD3BIzA',
  access_token_secret: 'oXDBkTVVJTbds0iHKKnTtXWKOaXitkonsxOtTc61kM'
})

exports.filterTweets = function(location) {
  const locations = [
    `${location.lng - locationBoxDelta}`,
    `${location.lat - locationBoxDelta}`,
    `${location.lng + locationBoxDelta}`,
    `${location.lat + locationBoxDelta}`
  ]

  console.log(locations)
  const stream = client.stream("statuses/filter", { locations: locations })
  stream.on('tweet', function(event) {
    console.log(event && event.text)
  })
  streams.push(stream)
}

exports.stopAllStreams = function() {
  streams.forEach (function(stream) {
    console.log('stopping ...')
    stream.stop()
  })
}
