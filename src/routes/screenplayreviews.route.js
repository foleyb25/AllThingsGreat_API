/*
Defines the controller endpoints and slug information for Screenplayreviews. The endpoints are defined 
here and the router is registered for app use in app.js
*/

const express = require('express');
const router = express.Router();
const Screenplayreview = require("../controllers/screenplayreviews.controller");
const {jwtCheck} = require("../lib/auth.lib")

module.exports = router;