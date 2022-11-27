var {expressjwt: jwt} = require('express-jwt');
var jwks = require('jwks-rsa');

exports.jwtCheck = jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://dev-dy7mypbw7zjf88ui.us.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://atgapi-auth0/',
    issuer: 'https://dev-dy7mypbw7zjf88ui.us.auth0.com/',
    algorithms: ['RS256']
});