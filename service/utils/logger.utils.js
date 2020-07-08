// var winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf  } = format;


const myFormat = printf(({ level, message, label, timestamp }) => {
  return `[${timestamp}] [${level.toUpperCase()}] [${label}] - ${message}`;
});

const logger = createLogger({  
    format: combine(
      timestamp(),
      myFormat
    ),  
    // transports: [
    //   new transports.Console({ level: 'info' }),
      
    // ]
    transports: [
      new transports.File({ filename: 'logs/isas-service.log',maxsize:10000000, maxFiles:10 })
    ]
  });

  module.exports=logger;