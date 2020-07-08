/* Declare required npm packages */
var sql = require('mssql');

const dotenv = require('dotenv').config();

/* Connection Configurations */
// var config = {
//   server: 'localhost',
//   database: 'ISAS_1.0',
//   user: 'sa',
//   password: 'Hospira1',
//   port: 1433
// };

var env = process.env.NODE_ENV || 'development';

let applicationConfig={
  development: {
    Server:process.env.DEV_DB_SERVER,
    Database: process.env.DEV_DB_DATABASE,
    Username:process.env.DEV_DB_USERNAME,
    Password: process.env.DEV_DB_PASSWORD,
    DatabasePort: parseInt(process.env.DEV_DB_Port),
    URL: process.env.DEV_APP_URL
  },
  production: {
    Server:process.env.PROD_DB_SERVER,
    Database: process.env.PROD_DB_DATABASE,
    Username:process.env.PROD_DB_USERNAME,
    Password: process.env.PROD_DB_PASSWORD,
    DatabasePort: parseInt(process.env.PROD_DB_Port),
    URL: process.env.PROD_APP_URL
  }
};

var config = {
  server: applicationConfig[env].Server,
  database: applicationConfig[env].Database,
  user: applicationConfig[env].Username,
  password: applicationConfig[env].Password,
  port: applicationConfig[env].DatabasePort
};

//var dbConn = new sql.ConnectionPool(config);

module.exports = {
  Config: config,
  ApplicationConfig:applicationConfig
};