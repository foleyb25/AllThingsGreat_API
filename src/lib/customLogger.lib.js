const { createLogger } = require('./logger.lib');

class CustomLogger {
    constructor() {
      
      this.logger = (process.env.NODE_ENV) !== 'development' ? createLogger() : undefined;
    }
  
    log(level, message, error = null) {
      if (process.env.NODE_ENV !== 'development') {
        if (error) {
          this.logger.log(level, message, error);
        } else {
          this.logger.log(level, message);
        }
      } else {
        let err = (error) ? `ERROR: ${error}` : '' 
        console.log(`${level}: ${message}. ${err}`)
      }
    }

    getLogger() {
        return this.logger;
      }
  
    error(message, error) {
        this.log('error', message, error);
    }
    
    warn(message) {
    this.log('warn', message);
    }

    info(message) {
    this.log('info', message);
    }

    http(message) {
    this.log('http', message);
    }

    verbose(message) {
    this.log('verbose', message);
    }

    debug(message) {
    this.log('debug', message);
    }

    silly(message) {
    this.log('silly', message);
    }
  }
  
  module.exports = CustomLogger;
  