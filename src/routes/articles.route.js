/*
Defines the controller endpoints and slug information for Articles. The endpoints are defined 
here and the router is registered for app use in app.js
*/

const express = require('express');
const router = express.Router();
const Article = require("../controllers/articles.controller");
const {jwtCheck} = require("../lib/auth.lib")
const {upload} = require("../lib/multer.lib")

router.get(`/user/:id`, Article.getArticlesByWriterId);
router.post(`/create`, jwtCheck, Article.create);
router.patch(`/update/:id`, jwtCheck, Article.update);
router.post(`/uploadImage`, [jwtCheck, upload.single("file")] , Article.uploadArticleImage)
router.get(`/getImageUrls`, jwtCheck, Article.getBucketUrls);
router.get('/test', Article.getArticleById)
router.get(`/:id`, Article.getArticleById); //keep this route at the bottom...trust me



module.exports = router;