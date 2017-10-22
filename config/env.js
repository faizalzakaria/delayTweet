var config = {
  production: {
    redis: {
      host: '127.0.0.1',
      port: 6379
    },
    twitter: {
      consumer_key:        'GBE5IyAQZxt5sF7OfVcjA',
      consumer_secret:     'APoTr51sLLvDnIKtLaOUPv2yu5bx0RVjAbSV61KDT8',
      access_token:        '165003539-kperMEDinOCvZJb18ypjL7JZ3eBSwONH8lD3BIzA',
      access_token_secret: 'oXDBkTVVJTbds0iHKKnTtXWKOaXitkonsxOtTc61kM'
    },
    resque: {
      connectionDetails: {
        pkg:       'ioredis',
        host:      '127.0.0.1',
        password:  null,
        port:      6379,
        database:  0,
        namespace: 'resque'
      }
    }
  },
  default: {
    redis: {
      host: '127.0.0.1',
      port: 6379
    },
    twitter: {
      consumer_key:        'GBE5IyAQZxt5sF7OfVcjA',
      consumer_secret:     'APoTr51sLLvDnIKtLaOUPv2yu5bx0RVjAbSV61KDT8',
      access_token:        '165003539-kperMEDinOCvZJb18ypjL7JZ3eBSwONH8lD3BIzA',
      access_token_secret: 'oXDBkTVVJTbds0iHKKnTtXWKOaXitkonsxOtTc61kM'
    },
    resque: {
      connectionDetails: {
        pkg:       'ioredis',
        host:      '127.0.0.1',
        password:  null,
        port:      6379,
        database:  0,
        namespace: 'resque'
      }
    }
  }
}

exports.get = function get(env) {
  return config[env] || config.default;
}
