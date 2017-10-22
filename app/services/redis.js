const redis = require("redis")

const client = redis.createClient({ host: '127.0.0.1', port: 6379 })

client.on("error", function (err) {
  console.log("Error " + err);
})

exports.addRequest = function (uuid, location) {
  client.set(`/${uuid}`, JSON.stringify(location))
}

exports.getRequest = function(uuid, callback) {
  client.get(uuid, function (err, reply) {
    const location = JSON.parse(reply)
    console.log(location)

    if (callback)
      callback(location)
  })
}
