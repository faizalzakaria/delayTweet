const path = require('path')
const env = require('./config/env')

/* Global variables */
global.__basedir = path.resolve(__dirname)
global.__config  = env.get(process.env.NODE_ENV)
