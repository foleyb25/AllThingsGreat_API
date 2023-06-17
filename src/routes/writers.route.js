/*
Defines the controller endpoints and slug information for Writers. The endpoints are defined 
here and the router is registered for app use in app.js
*/

const express = require('express');
const router = express.Router();
const Writer = require("../controllers/writers.controller");
const {jwtCheck} = require("../lib/auth.lib")

router.get(`/authID/:authID`, jwtCheck, Writer.getWriterByAuthID);
router.post(``, jwtCheck, Writer.create);
router.patch(``, jwtCheck, Writer.update);
router.get(`/getProfileImageUrls/:writerId`, jwtCheck, Writer.getProfileBucketUrls);
router.patch('/:id/draft', jwtCheck, Writer.saveDraft)
router.delete('/:writerId/draft/:draftId', jwtCheck, Writer.deleteDraft)

module.exports = router;