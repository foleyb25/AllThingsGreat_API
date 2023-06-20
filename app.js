const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const AppError = require('./src/lib/app_error.lib');
const globalErrorHandler = require('./src/controllers/error.controller');
const { ERROR_404 } = require('./src/lib/constants.lib');
const {API_V2} = require("./src/lib/constants.lib")

const app = express();
app.enable('trust proxy');
//middleware
app.use(cors());
app.options('*', cors()); //Responding to the OPTIONS REQUEST for the pre-flight phase for non-simple requests(PATCH,
// DELETE, PUT) sending CORS
//rate limiting global middleware
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 1000,
  message: 'Too many requests from this ip, please try again',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('*', limiter);


app.use(express.json({limit: "150kb"}));
app.use(express.urlencoded({ extended: true, limit: "150kb" }));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        'child-src': ['blob:'],
        'connect-src': [
          `http://localhost:${process.env.PORT}`,
          'https://allthingsgreatwriter.app',
          'https://allthingsgreat.com',
        ],
        'default-src': ["'self'"],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'img-src': ["'self'", 'data:', 'blob:'],
        'script-src': ["'self'", 'https://*.fly.dev'],
        'style-src': ["'self'", "'unsafe-inline'", 'https:'],
        'worker-src': ['blob:'],
      },
    },
  })
); //added middleware to set security headers

app.use(cookieParser()); //middleware parses cookie data
//Data Sanitization against NoSQL query injection
app.use(mongoSanitize()); //package: express-mongo-sanitize
//Data Sanitization against Xss attacks
// app.use(xss()); //package: xss-clean
//Prevent parameter pollution
// app.use(hpp({ whitelist: [] })); //package: hpp
//adding request time to the payload
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(compression()); //added the compression middleware to help compress text and JSON responses

//Routes prefix
app.use(`${API_V2}/articles`, require("./src/routes/articles.route"));
app.use(`${API_V2}/writers`, require("./src/routes/writers.route"));
app.use(`${API_V2}/users`, require("./src/routes/users.route"));
// app.use(``, require("./src/routes/comments.route"));
// app.use(`${API_V2}/screenplayreviews`, require("./src/routes/screenplayreviews.route"));
// app.use(`${API_V2}/screenplays`, require("./src/routes/screenplays.route"));
// app.use(``, require("./src/routes/watchservices.route"));

if (process.env.NODE_ENV === 'production') {
    app.use(morgan('dev')); //using the morgan logging middleware for development
  }
  if (process.env.NODE_ENV === 'production') {
    const { createLogger } = require('./src/lib/logger.lib');
    const logger = createLogger();
    //log requests that results in http code >=400
    app.use(
      morgan(
        function (tokens, req, res) {
          return JSON.stringify({
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: Number.parseFloat(tokens.status(req, res)),
            content_length: tokens.res(req, res, 'content-length'),
            response_time: Number.parseFloat(tokens['response-time'](req, res)),
            ip: tokens['remote-addr'](req, res),
            userAgent: tokens['user-agent'](req, res),
          });
        },
        {
          skip: function (req, res) {
            return res.statusCode < 400;
          },
          stream: {
            // Configure Morgan to use our custom logger
            write: (message) =>
              logger.warn(`incoming-request`, {
                requestPayload: JSON.parse(message),
              }),
          },
        }
      )
    );
  }
  
  //*********GLOBAL ERROR HANDLING FOR ALL ENDPOINTS**************
  //handling exception for other routes not declared above
  app.all('*', (req, res, next) => {
    //using the AppError class
    next(new AppError(`Can't find ${req.originalUrl} on this server`, ERROR_404));
  });
  
  //error handling middleware
  app.use(globalErrorHandler);
  
  module.exports = app;