const webSocketsController = require(__basedir + '/app/controllers/webSocketsController')

module.exports = function(app) {
  app.route('/webSockets')
    .post(webSocketsController.create)
}
