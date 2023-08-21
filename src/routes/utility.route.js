/*
Defines the controller endpoints and slug information for Users. The endpoints are defined
here and the router is registered for app use in app.js
*/

const express = require("express");

const router = express.Router();
const Utility = require("../controllers/utility.controller");

router.post("/downloadPDF", Utility.downloadPDF);

module.exports = router;
