const winston = require('winston');
require('winston-daily-rotate-file');
require('winston-mongodb');
const { Logtail } = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');

const { combine, timestamp, json, errors } = winston.format;

exports.createLogger = () => {
  const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '365d',
  });
  const logTail = new Logtail(process.env.LOGTAIL_TOKEN);
  const logTailTransport = new LogtailTransport(logTail);
  const mongodbTransport = new winston.transports.MongoDB({
    level: 'info',
    //mongo database connection link
    db: process.env.LOG_DB.replace(
      '<password>',
      process.env.DB_PASSWORD
    ),
    options: {
      useUnifiedTopology: true,
      poolSize: 2,
      useNewUrlParser: true,
    },
    // A collection to save json formatted logs
    collection: process.env.LOG_COLLECTION,
    metaKey: 'stack',
  });

  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
      timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
      }),
      json(),
      errors({ stack: true })
    ),
    transports: [
      logTailTransport,
      mongodbTransport,
      new winston.transports.Console(),
      fileRotateTransport,
    ],
    exceptionHandlers: [
      logTailTransport,
      mongodbTransport,
      new winston.transports.File({ filename: 'logs/exceptions.log' }),
    ],
    rejectionHandlers: [
      logTailTransport,
      mongodbTransport,
      new winston.transports.File({ filename: 'logs/rejections.log' }),
    ],
  });
};
