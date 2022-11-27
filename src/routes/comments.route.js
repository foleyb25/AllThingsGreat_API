/*
Defines the controller endpoints and slug information for Comments. The endpoints are defined 
here and the router is registered for app use in app.js
*/

const express = require('express');
const router = express.Router();
const Comment = require("../controllers/comments.controller");

router.get(``, Comment.getAll)
router.get(`/:id`, Comment.getById);
router.post(``, Comment.create);
router.patch(`/:id`, Comment.update);
// router.delete(`${comments_slug}:id`, Comment.remove);

module.exports = router;