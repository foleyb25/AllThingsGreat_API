require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const app = require('./app');
const CustomLogger = require('./src/lib/customLogger.lib');

const logger = new CustomLogger();

const connectDB = async () => {
  const DB = process.env.DB_URI.replace(
    '<password>',
    process.env.DB_PASSWORD
  );
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    logger.info('DB Connection successful');
  } catch (err) {
    logger.error(`DB Connection failed.`, err);
    process.exit(1);
  }
};

async function createServer() {
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception. Shutting Down', err);
    process.exit(1);
  });

  if (process.env.NODE_ENV !== 'test') {
    await connectDB();
  }

  return app;
}

(async function startServer() {
  const port = process.env.PORT || 8000;
  const appServer = await createServer();

  const server = appServer.listen(port, () => {
    logger.info(`App running on port ${port} in ${process.env.NODE_ENV} Environment...`);
  }).on('error', (err) => {
    logger.error('Error starting server:', err);
  });

  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection. Shutting Down', err);
    server.close(async () => {
        try {
            await mongoose.connection.close();
            logger.info('DB Connection closed');
            process.exit(1);
        } catch (err) {
            logger.error('Error closing DB Connection', err);
            process.exit(1);
        }
    });
});

async function shutdown(signal, err = null) {
  if (err) {
      logger.error(`${signal} received. Shutting Down due to Unhandled Rejection`, err);
      process.exitCode = 1;
  } else {
      logger.info(`${signal} received. Shutting down gracefully`);
  }
  
  server.close(async () => {
      try {
          await mongoose.connection.close();
          logger.info('DB Connection closed');
      } catch (err) {
          logger.error('Error closing DB Connection', err);
          process.exitCode = 1;
      } finally {
          process.exit(process.exitCode);
      }
  });
}

process.on('unhandledRejection', (err) => {
  shutdown('Unhandled Rejection', err);
});

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  shutdown('SIGINT');
});

})();
