'use strict'

module.exports = function(app) {
  let tweetsController = require('../controllers/tweetsController');

  app.route('/tweets')
    .post(tweetsController.createTweet)
}
