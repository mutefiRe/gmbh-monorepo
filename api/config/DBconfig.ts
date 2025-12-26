module.exports = function () {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        database: process.env.GMBH_DB || "gmbh",
        user: process.env.GMBH_DB_USER || "root",
        password: process.env.GMBH_DB_PASSWORD || "",
        options: {
          logging: false,
          host: process.env.GMBH_DB_HOST || "localhost",
          port: process.env.GMBH_DB_PORT || 3306,
          dialect: process.env.GMBH_DB_DIALECT || 'mysql',
          timezone: '+01:00'
        }
      };
    case 'test':
      return {
        database: process.env.GMBH_DB_TEST || "gmbh_test",
        user: process.env.GMBH_DB_USER || "root",
        password: process.env.GMBH_DB_PASSWORD || "",
        options: {
          logging: false,
          host: process.env.GMBH_DB_HOST || "localhost",
          port: process.env.GMBH_DB_PORT || 3306,
          dialect: process.env.GMBH_DB_DIALECT || 'mysql',
          timezone: '+01:00'
        }
      };
    case 'production':
      return {
        database: process.env.GMBH_DB || "gmbh",
        user: process.env.GMBH_DB_USER || "root",
        password: process.env.GMBH_DB_PASSWORD || "",
        options: {
          logging: false,
          host: process.env.GMBH_DB_HOST || "localhost",
          port: process.env.GMBH_DB_PORT || 3306,
          dialect: process.env.GMBH_DB_DIALECT || 'postgres',
          timezone: '+01:00'
        }
      };
    case 'test-ci':
      return {
        database: process.env.GMBH_DB || "gmbh_test",
        user: process.env.GMBH_DB_USER || "root",
        password: process.env.GMBH_DB_PASSWORD || "GMBH",
        options: {
          logging: false,
          host: process.env.GMBH_IP || "mysql",
          port: process.env.GMBH_DB_PORT || 3306,
          dialect: process.env.GMBH_DB_DIALECT || 'mysql',
          timezone: '+01:00'
        }
      };
    default:
      return {
        database: process.env.GMBH_DB || "gmbh",
        user: process.env.GMBH_DB_USER || "root",
        password: process.env.GMBH_DB_PASSWORD || "",
        options: {
          logging: false,
          host: process.env.GMBH_IP || "localhost",
          port: process.env.GMBH_DB_PORT || 3306,
          dialect: process.env.GMBH_DB_DIALECT || 'mysql',
          timezone: '+01:00'
        }
      };
  }
};
