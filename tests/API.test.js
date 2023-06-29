require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const {
  OK_200,
  OK_CREATED,
  OK_NO_CONTENT,
  ERROR_404,
  ERROR_500,
} = require("../src/lib/constants.lib");
// const CustomLogger = require('../src/lib/customLogger.lib');

// let logger = new CustomLogger();

beforeAll((done) => {
  // connect to test db before running the tests
  console.log("DB: ", process.env.TEST_DB_URI);
  mongoose.connect(
    process.env.TEST_DB_URI.replace("<password>", process.env.DB_PASSWORD),
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    },
    () => done()
  );
});

afterAll(async () => {
  // empty db after all tests
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
  // if (logger.logger.transports.mongodb) {
  //   await new Promise((resolve, reject) => {
  //     logger.logger.transports.mongodb.once('finished', resolve);
  //     logger.logger.transports.mongodb.once('error', reject);
  //     logger.logger.transports.mongodb.close();
  //   });
  // }
});

// describe('CustomLogger Class', () => {
//   let logger;

//   beforeEach(() => {
//     // Initialize a new CustomLogger instance before each test
//     logger = new CustomLogger();
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should create a new instance of CustomLogger', () => {
//     expect(logger).toBeInstanceOf(CustomLogger);
//   });

//   it('should call error method correctly', () => {
//     const spy = jest.spyOn(logger.getLogger(), 'log');
//     const errorMessage = 'Test error';
//     const errorObject = new Error('Test error object');

//     logger.error(errorMessage, errorObject);

//     expect(spy).toHaveBeenCalledWith('error', errorMessage, errorObject);
//   });

//   // Repeat the similar structure for other methods like warn, info, http, verbose, debug, silly
//   it('should call info method correctly', () => {
//     const spy = jest.spyOn(logger.getLogger(), 'log');
//     const infoMessage = 'Test info';

//     logger.info(infoMessage);

//     expect(spy).toHaveBeenCalledWith('info', infoMessage);
//   });

//   // ... and so on for the other methods
// });

// describe('ATG ENDPOINT TESTING', function () {
//   it('GET ...', async () => {
//     const response = await request(app).get('INSERT ENDPOINT URL');
//     //expect(response.statusCode).toEqual(OK_200);
//     //expect(Array.isArray(response.body.data)).toBeTruthy();
//     //expect(response.body.data.length).toEqual(6);
//   });
//   //insert other cases
// });
