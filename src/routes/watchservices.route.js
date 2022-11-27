/*
Defines the controller endpoints and slug information for Watchservices. The endpoints are defined 
here and the router is registered for app use in app.js
*/

const express = require('express');
const router = express.Router();
const Watchservice = require("../controllers/watchservices.controller");

module.exports = router;