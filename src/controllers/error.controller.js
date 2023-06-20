const AppError = require('../lib/app_error.lib');
const  CustomLogger = require('../lib/customLogger.lib');
const { ERROR_400, ERROR_500 } = require('../lib/constants.lib');
const logger = new CustomLogger()

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, ERROR_400);
};

const handleDuplicateFieldsDB = (err) => {
  const key = Object.keys(err.keyValue).join('');
  const message = `The key '${key}' has duplicate value of '${err.keyValue[key]}'`;
  return new AppError(message, ERROR_400);
};

const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, req, res) => {
  const message = err.isOperational ? err.message : 'Please try again later!';
  //is operational error, send to client
  return res.status(err.statusCode).json({
    status: err.status,
    message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode ?? ERROR_500;
  err.status = err.status ?? 'error';

  if (process.env.NODE_ENV !== 'test') {
    logger.error(err);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err }; //desctructure and make a copy of the error.
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    sendErrorProd(error, req, res);
  }
};
