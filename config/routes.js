const webSocketsController = require(__basedir + '/app/controllers/webSocketsController')

module.exports = function (app) {
  app.route('/websockets')
    .post(webSocketsController.create)
}
