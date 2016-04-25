module.exports = function(){
  switch(process.env.NODE_ENV){
    case 'development':
      return {
        database: "gmbh",
        user: "root",
        password: "",
        host: {
          hostname: "localhost",
          port: 3306
        }
      };
    case 'test':
      return {
        database: "gmbh-test",
        user: "root",
        password: "",
        host: {
          hostname: "localhost",
          port: 3306
        }
      };
    case'production':
      return {
        database: "gmbh-production",
        user: "root",
        password: "",
        host: {
          hostname: "localhost",
          port: 3306
        }
      }
  }
}
