/*
Defines the controller endpoints and slug information for Screenplays. The endpoints are defined 
here and the router is registered for app use in app.js
*/

const express = require('express');
const router = express.Router();
const Screenplays = require("../controllers/screenplays.controller");
const {jwtCheck} = require("../lib/auth.lib")

router.get(`/:pageNum/:searchString`, jwtCheck, Screenplays.searchScreenplays);

module.exports = router;