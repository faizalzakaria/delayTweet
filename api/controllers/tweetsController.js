'use strict'

const twitterService = require('../services/twitterService')
const uuidv1 = require('uuid/v1');

exports.createTweet = function(req, res) {
  const { lat, lng } = req.body

  if (!lat || !lng) {
    res.statusCode = 400
    res.json({ status: "error, missing lat or lng" })
    return
  }

  const location = { lat: lat, lng: lng }

  const wsUrl = `ws://127.0.0.1:8080/${uuidv1()}`

  res.statusCode = 200
  res.json({ wsUrl: wsUrl })
}
