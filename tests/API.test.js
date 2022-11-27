const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../../server');
const {
  OK_200,
  OK_CREATED,
  OK_NO_CONTENT,
  ERROR_404,
  ERROR_500,
} = require('../lib/constants.lib');

beforeAll((done) => {
  //connect to test db before running the tests
  mongoose.connect(
    '',
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    },
    () => done()
  );
});

afterAll((done) => {
  //empty db after all tests
  mongoose.connection.db.dropDatabase(() =>
    mongoose.connection.close(() => done())
  );
});

const app = server();

describe('ATG ENDPOINT TESTING', function () {
  it('GET forms', async () => {
    const response = await request(app).get('INSERT ENDPOINT URL');
    //expect(response.statusCode).toEqual(OK_200);
    //expect(Array.isArray(response.body.data)).toBeTruthy();
    //expect(response.body.data.length).toEqual(6);
  });
  //insert other cases
});
