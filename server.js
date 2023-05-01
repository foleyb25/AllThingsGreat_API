const mongoose = require('mongoose');
const app = require('./app');
// const { createLogger } = require('./src/lib/logger.lib');

//this file serves a dual purpose as an entry point for automated testing as well as development
//and production environment

function createServer() {
  process.on('uncaughtException', (err) => {
    //uncaught exception, log errors and shutdown gracefully
    // const logger = createLogger();
    // logger.error('Uncaught Exception. Shutting Down', err);
    process.exitCode = 1;
  });

  if (process.env.NODE_ENV === 'development') {
    //initialize the database using the environment variables.
    const DB = process.env.DB_URI_STAG.replace(
      '<password>',
      process.env.DB_PASSWORD
    );
    mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    
    mongoose.connection.on('connected', () => {
      console.log('DB Connection successful to Staging!');
    });
    
    mongoose.connection.on('error', (err) => {
      console.log(`DB Connection failed to Staging: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('DB Connection disconnected from Staging');
    });
  } else if (process.env.NODE_ENV === 'production') {
    //initialize the database using the environment variables.
    const DB = process.env.DB_URI_PROD.replace(
      '<password>',
      process.env.DB_PASSWORD
    );
    mongoose
      .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      .then(
        () => console.log('DB Connection successful!'),
        (err) => console.log(`DB Connection failed!: ${err}`)
      );
  }
  return app;
}

module.exports = createServer;
