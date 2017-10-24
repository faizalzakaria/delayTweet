const path = require('path')
const config = require('./config')

/* Global variables */
global.__basedir = path.resolve(__dirname, '../')
global.__config = config.get(process.env.NODE_ENV)
