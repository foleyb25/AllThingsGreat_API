/*
Defines the controller endpoints and slug information for Users. The endpoints are defined
here and the router is registered for app use in app.js
*/

const express = require("express");

const router = express.Router();
const User = require("../controllers/users.controller");

router.post("/application/submit", User.submitApplication);
router.get("/applications", User.getApplications);

module.exports = router;
