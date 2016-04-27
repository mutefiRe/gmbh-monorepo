module.exports = function(){
  switch(process.env.NODE_ENV){
    case 'development':
      return {
        database: "gmbh",
        user: "root",
        password: "",
        host: {
          host: "localhost",
          port: 3306
        }
      };
    case 'test':
      return {
        database: "gmbh_test",
        user: "root",
        password: "",
        host: {
          host: "localhost",
          port: 3306
        }
      };
    case'production':
      return {
        database: "gmbh_production",
        user: "root",
        password: "",
        host: {
          host: "localhost",
          port: 3306
        }
      }
  }
}
