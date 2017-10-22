const TAG = 'REDIS'

const logger = require(__basedir + '/app/services/logger')
const redis = require('redis')

const client = redis.createClient(__config.redis)

client.on('error', function (err) {
  logger.log(TAG, 'Error ' + err)
})

exports.addRequest = function (uuid, location) {
  client.set(`/${uuid}`, JSON.stringify(location))
}

exports.getRequest = function (uuid, callback) {
  client.get(uuid, function (err, reply) {
    if (err) {
      console.log(err)
    } else {
      const location = JSON.parse(reply)

      if (callback) { callback(location) }
    }
  })
}
