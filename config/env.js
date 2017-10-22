const config = {
  production: {
    app: {
      tweetDelay: 24 * 60, // in minute
      locationBoxDelta: 0.01 // In degree, delta for the bounding box.
    },
    redis: {
      host: '127.0.0.1',
      port: 6379
    },
    twitter: {
      consumer_key: 'GBE5IyAQZxt5sF7OfVcjA',
      consumer_secret: 'APoTr51sLLvDnIKtLaOUPv2yu5bx0RVjAbSV61KDT8',
      access_token: '165003539-kperMEDinOCvZJb18ypjL7JZ3eBSwONH8lD3BIzA',
      access_token_secret: 'oXDBkTVVJTbds0iHKKnTtXWKOaXitkonsxOtTc61kM'
    },
    resque: {
      connectionDetails: {
        pkg: 'ioredis',
        host: '127.0.0.1',
        password: null,
        port: 6379,
        database: 0,
        namespace: 'resque'
      }
    },
    websocket: {
      host: '127.0.0.1',
      port: 8080
    }
  },
  default: {
    app: {
      tweetDelay: 24 * 60, // in minute
      locationBoxDelta: 0.01 // In degree, delta for the bounding box.
    },
    redis: {
      host: '127.0.0.1',
      port: 6379
    },
    twitter: {
      consumer_key: 'GBE5IyAQZxt5sF7OfVcjA',
      consumer_secret: 'APoTr51sLLvDnIKtLaOUPv2yu5bx0RVjAbSV61KDT8',
      access_token: '165003539-kperMEDinOCvZJb18ypjL7JZ3eBSwONH8lD3BIzA',
      access_token_secret: 'oXDBkTVVJTbds0iHKKnTtXWKOaXitkonsxOtTc61kM'
    },
    resque: {
      connectionDetails: {
        pkg: 'ioredis',
        host: '127.0.0.1',
        password: null,
        port: 6379,
        database: 0,
        namespace: 'resque'
      }
    },
    websocket: {
      host: '127.0.0.1',
      port: 8080
    }
  }
}

exports.get = function get (env) {
  return config[env] || config.default
}
