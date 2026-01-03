const buildConfig = (env) => {
  const isTest = env === 'test' || env === 'test-ci';
  const database = isTest
    ? process.env.GMBH_DB_TEST || 'gmbh_test'
    : process.env.GMBH_DB || 'gmbh';

  return {
    username: process.env.GMBH_DB_USER || 'root',
    password: process.env.GMBH_DB_PASSWORD || '',
    database,
    host: process.env.GMBH_DB_HOST || (env === 'test-ci' ? 'mysql' : 'localhost'),
    port: Number(process.env.GMBH_DB_PORT || 3306),
    dialect: process.env.GMBH_DB_DIALECT || 'mysql',
    logging: false,
    timezone: '+01:00'
  };
};

module.exports = {
  development: buildConfig('development'),
  test: buildConfig('test'),
  production: buildConfig('production'),
  'test-ci': buildConfig('test-ci')
};
