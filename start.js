const createServer = require('./server');
// const { createLogger } = require('./src/lib/logger.lib');

//this file servers as the entry point for dev/production as well as test environment

//START THE SERVER
const port = process.env.PORT || 8000; //read port from environment if available else use defined port
const app = createServer();

const server = app.listen(port, () => {
  console.log(`App running on port ${port} in ${process.env.NODE_ENV} Environment...`);
}).on('error', (err) => {
  console.error('Error starting server:', err);
});

//listening for a unhandledRejection event globally
process.on('unhandledRejection', (err) => {
  // const logger = createLogger();
  // logger.error('Unhandled REJECTION. Shutting Down', err);
  //close the server gracefully after logging the error stack
  server.close(() => {
    process.exitCode = 1;
  });
});

process.on('SIGTERM', () => {
  // const logger = createLogger();
  // logger.info('SIGTERM RECEIVED. Shutting down gracefully');
  //SIGTERM received from CPU; shutdown the server gracefully
  server.close(() => {
    process.exitCode = 1;
  });
});

