require('./config/environment')

const delayTweetJob = require('./app/jobs/delayTweetJob')

delayTweetJob.startWorker()
delayTweetJob.startScheduler()
