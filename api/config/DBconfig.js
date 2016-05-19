module.exports = function(){
  switch(process.env.NODE_ENV){
    case 'development':
    return {
      database: "gmbh",
      user: "root",
      password: "",
      host: {
        host: process.env.GMBH_IP || "localhost",
        port: 3306,
        dialect:  process.env.GMBH_DB_DIALECT || 'mysql'
      },

    };
    case 'test':
    return {
      database: "gmbh_test",
      user: "root",
      password: "",
      host: {
        pool: false,
        logging: false,
        host: process.env.GMBH_IP || "localhost",
        port: 3306,
        dialect: process.env.GMBH_DB_DIALECT || 'mysql'
      }
    };
    case'production':
    return {
      database: process.env.GMBH_DB || "gmbh_production",
      user: process.env.GMBH_DB_USER || "root",
      password: process.env.GMBH_DB_PASSWORD || "",
      host: {
        host: process.env.GMBH_DB_HOST || "localhost",
        port:  process.env.GMBH_DB_PORT || 3306,
        dialect: process.env.GMBH_DB_DIALECT || 'postgres'
      }
    };
    case 'circleci':
    return {
      database: "circle_test",
      user: "ubuntu",
      password: "",
      host: {
        pool: false,
        hostname: process.env.GMBH_IP || "localhost",
        port: 3306,
        dialect: process.env.GMBH_DB_DIALECT || 'mysql'
      }
    }
    default:
    return {
      database: "gmbh",
      user: "root",
      password: "",
      host: {
        host: "localhost",
        port: 3306,
        dialect:  process.env.GMBH_DB_DIALECT || 'mysql'
      }
    }
  }
}
