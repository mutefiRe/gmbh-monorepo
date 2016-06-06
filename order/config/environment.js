module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'gmbh',
    environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      host: ('http://'+process.env.GMBH_BACKEND) || 'http://localhost:8080'
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    contentSecurityPolicy: {
      'default-src': '\'none\'',
      'script-src': '\'self\' \'unsafe-inline\' \'unsafe-eval\'',
      'font-src': '\'self\'',
      'connect-src': '\'self\' ws://'+process.env.GMBH_BACKEND+' localhost:8080',
      'img-src': '\'self\'',
      'report-uri': '\'localhost\'',
      'style-src': '\'self\' \'unsafe-inline\'',
      'frame-src': '\'none\''
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV['ember-cli-mirage'] = {
      enabled: false
    };
  }

  ENV['ember-simple-auth-token'] = {
    authorizationPrefix: ' ',
    authorizationHeaderName: 'x-access-token',
    refreshAccessTokens: false,
    serverTokenEndpoint: (('http://'+process.env.GMBH_BACKEND) || 'http://localhost:8080') + '/authenticate',
    timeFactor: 1000
  };

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
