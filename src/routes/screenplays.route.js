/*
Defines the controller endpoints and slug information for Screenplays. The endpoints are defined 
here and the router is registered for app use in app.js
*/

const express = require('express');
const router = express.Router();
const Screenplays = require("../controllers/screenplays.controller");

router.get(``, Screenplays.getAll)
router.get(`/:id`, Screenplays.getById);
router.get(`/:pageNum/:searchString`, Screenplays.searchScreenplays);
router.post(``, Screenplays.create);
router.patch(`/:id`, Screenplays.update);
// router.delete(`${screenplays_slug}:id`, Screenplays.remove);

module.exports = router;