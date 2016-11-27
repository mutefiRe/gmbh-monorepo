module.exports = function(){
  switch(process.env.NODE_ENV){
    case 'development':
    return {
      database: process.env.GMBH_DB          || "gmbh",
      user:     process.env.GMBH_DB_USER     || "root",
      password: process.env.GMBH_DB_PASSWORD || "",
      host: {
        host:    process.env.GMBH_DB_HOST    || "localhost",
        port:    process.env.GMBH_DB_PORT    || 3306,
        dialect: process.env.GMBH_DB_DIALECT || 'mysql'
      }
    };
    case 'test':
    return {
      database: process.env.GMBH_DB_TEST     || "gmbh_test",
      user:     process.env.GMBH_DB_USER     || "root",
      password: process.env.GMBH_DB_PASSWORD || "",
      host: {
        pool: false,
        logging: false,
        host:    process.env.GMBH_DB_HOST    || "localhost",
        port:    process.env.GMBH_DB_PORT    || 3306,
        dialect: process.env.GMBH_DB_DIALECT || 'mysql'
      }
    };
    case'production':
    return {
      database:  process.env.GMBH_DB          || "gmbh_production",
      user:      process.env.GMBH_DB_USER     || "root",
      password:  process.env.GMBH_DB_PASSWORD || "",
      host: {
        host:    process.env.GMBH_DB_HOST    || "localhost",
        port:    process.env.GMBH_DB_PORT    || 3306,
        dialect: process.env.GMBH_DB_DIALECT || 'postgres'
      }
    };
    case 'circleci':
    return {
      database: process.env.GMBH_DB          || "circleci_test",
      user:     process.env.GMBH_DB_USER     || "ubuntu",
      password: process.env.GMBH_DB_PASSWORD || "",
      host: {
        pool:     false,
        logging:  false,
        hostname: process.env.GMBH_IP         || "localhost",
        port:     process.env.GMBH_DB_PORT    || 3306,
        dialect:  process.env.GMBH_DB_DIALECT || 'mysql'
      }
    };
    default:
    return {
      database:  process.env.GMBH_DB          || "gmbh",
      user:      process.env.GMBH_DB_USER     || "root",
      password:  process.env.GMBH_DB_PASSWORD || "",
      host: {
        hostname: process.env.GMBH_IP         || "localhost",
        port:     process.env.GMBH_DB_PORT    || 3306,
        dialect:  process.env.GMBH_DB_DIALECT || 'mysql'
      }
    };
  }
};
