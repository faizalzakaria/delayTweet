const uuidv1 = require('uuid/v1')
const redisClient = require(__basedir + '/app/services/redis')

exports.create = function(req, res) {
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
