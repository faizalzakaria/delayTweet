'use strict'

const redisClient = require('../services/redis')
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
  const uuid = uuidv1()
  const wsUrl = `ws://127.0.0.1:8080/${uuid}`

  redisClient.addRequest(uuid, location)

  res.statusCode = 200
  res.json({ wsUrl: wsUrl })
}
