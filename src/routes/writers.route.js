/*
Defines the controller endpoints and slug information for Writers. The endpoints are defined 
here and the router is registered for app use in app.js
*/

const express = require('express');
const router = express.Router();
const Writer = require("../controllers/writers.controller");
const {jwtCheck} = require("../lib/auth.lib")

router.get(`/authID/:authID`, jwtCheck, Writer.getUserByAuthID);
router.post(``, jwtCheck, Writer.create);
router.patch(``, jwtCheck, Writer.update);


// router.delete(`${writers_slug}:id`, Writer.remove);

module.exports = router;