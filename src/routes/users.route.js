/*
Defines the controller endpoints and slug information for Users. The endpoints are defined 
here and the router is registered for app use in app.js
*/

const express = require('express');
const router = express.Router();
const User = require("../controllers/users.controller");

router.get(``, User.getAll)
router.get(`/:id`, User.getById);
router.post(``, User.create);
router.patch(`/:id`, User.update);
// router.delete(`${screenplays_slug}:id`, Screenplay.remove);

module.exports = router;