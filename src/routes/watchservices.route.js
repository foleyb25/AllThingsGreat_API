/*
Defines the controller endpoints and slug information for Watchservices. The endpoints are defined 
here and the router is registered for app use in app.js
*/

const express = require('express');
const router = express.Router();
const Watchservice = require("../controllers/watchservices.controller");

router.get(``, Watchservice.getAll)
router.get(`/:id`, Watchservice.getById);
router.post(``, Watchservice.create);
router.patch(`/:id`, Watchservice.update);
// router.delete(`${watchservices_slug}:id`, Watchservice.remove);

module.exports = router;