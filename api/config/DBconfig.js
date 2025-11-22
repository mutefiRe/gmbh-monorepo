module.exports = function(){
  switch(process.env.NODE_ENV){
    case 'development':
      return {
        database: process.env.GMBH_DB          || "gmbh",
        user:     process.env.GMBH_DB_USER     || "root",
        password: process.env.GMBH_DB_PASSWORD || "",
        options: {
          host:     process.env.GMBH_DB_HOST    || "localhost",
          port:     process.env.GMBH_DB_PORT    || 3306,
          dialect:  process.env.GMBH_DB_DIALECT || 'mysql',
          timezone: 'Europe/Vienna'
        }
      };
    case 'test':
      return {
        database: process.env.GMBH_DB_TEST     || "gmbh_test",
        user:     process.env.GMBH_DB_USER     || "root",
        password: process.env.GMBH_DB_PASSWORD || "",
        options: {
          pool:     false,
          logging:  false,
          host:     process.env.GMBH_DB_HOST    || "localhost",
          port:     process.env.GMBH_DB_PORT    || 3306,
          dialect:  process.env.GMBH_DB_DIALECT || 'mysql',
          timezone: 'Europe/Vienna'
        }
      };
    case'production':
      return {
        database:  process.env.GMBH_DB          || "gmbh_production",
        user:      process.env.GMBH_DB_USER     || "root",
        password:  process.env.GMBH_DB_PASSWORD || "",
        options: {
          host:     process.env.GMBH_DB_HOST    || "localhost",
          port:     process.env.GMBH_DB_PORT    || 3306,
          dialect:  process.env.GMBH_DB_DIALECT || 'postgres',
          timezone: 'Europe/Vienna'
        }
      };
    case 'test-ci':
      return {
        database: process.env.GMBH_DB          || "gmbh_test",
        user:     process.env.GMBH_DB_USER     || "root",
        password: process.env.GMBH_DB_PASSWORD || "GMBH",
        options: {
          pool:      false,
          logging:   false,
          host:      process.env.GMBH_IP             || "mysql",
          port:      process.env.GMBH_DB_PORT    || 3306,
          dialect:   process.env.GMBH_DB_DIALECT || 'mysql',
          timezone: 'Europe/Vienna'
        }
      };
    default:
      return {
        database:  process.env.GMBH_DB          || "gmbh",
        user:      process.env.GMBH_DB_USER     || "root",
        password:  process.env.GMBH_DB_PASSWORD || "",
        options: {
          host:      process.env.GMBH_IP         || "localhost",
          port:      process.env.GMBH_DB_PORT    || 3306,
          dialect:   process.env.GMBH_DB_DIALECT || 'mysql',
          timezone: 'Europe/Vienna'
        }
      };
  }
};
