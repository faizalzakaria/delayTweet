const delayTweetJob = require('./app/jobs/delayTweetJob')

delayTweetJob.startWorker()
delayTweetJob.startScheduler()
