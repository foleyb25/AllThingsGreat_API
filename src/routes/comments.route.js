/*
Defines the controller endpoints and slug information for Comments. The endpoints are defined 
here and the router is registered for app use in app.js
*/

const express = require('express');
const router = express.Router();
const Comment = require("../controllers/comments.controller");

module.exports = router;