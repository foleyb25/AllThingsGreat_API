/*
Defines the controller endpoints and slug information for Articles. The endpoints are defined 
here and the router is registered for app use in app.js
*/

const express = require('express');
const router = express.Router();
const Article = require("../controllers/articles.controller");
const {jwtCheck} = require("../lib/auth.lib")
const {upload} = require("../lib/multer.lib")

// router.get(``, Article.getAll)
// router.get(`/:id`, Article.getById);
// router.post(``, Article.create);
router.post(`/uploadImage`, [jwtCheck, upload.single("file")] , Article.uploadArticleImage)

module.exports = router;