// HTTP Methods
exports.GET = "get";
exports.POST = "post";
exports.PUT = "put";
exports.DELETE = "delete";
exports.OPTIONS = "options";
exports.patch = "patch";

// HTTP Client Success responses
exports.OK_200 = 200;
exports.OK_CREATED = 201;
exports.OK_NO_CONTENT = 204;
exports.SUCCESS = "success";
exports.FAIL = "fail";
/* HTTP Client Error Responses */
exports.ERROR_404 = 404; /* Not Found */
exports.ERROR_400 = 400; /* Bad Request */
exports.ERROR_401 = 401; /* Unauthorized */
exports.ERROR_403 = 403; /* Forbidden */
exports.ERROR_405 = 405; /* Method Not Allowed */
exports.ERROR_406 = 406; /* Not Acceptable */
exports.ERROR_409 = 409; /* Conflict */
exports.ERROR_413 = 413; /* Payload Too Large. */
exports.ERROR_418 = 418; /* I'm a Teapot. Server does not wish to handle request. */

/* HTTP Server Error Responses */
exports.ERROR_500 = 500; /* Internal Server Error */
exports.ERROR_503 = 503; /* Service Unavailable. Overloaded server. */
exports.ERROR_511 = 511; /* Network Authentication Required. */

// app constants
exports.API_V2 = "/api/v2";

// article Categories
exports.ATG = "AllThingsGreat";
exports.CS = "Combat Sports";
exports.CRYPTO = "Cryptocurrency";
exports.COLFOOT = "College Football";
exports.AIT = "A.I. & Technology";
exports.HEALTH = "Health & Fitness";
exports.EXTRAORDINARY = "Extraordinary";
exports.MATCHUP = "Matchup Analysis";
