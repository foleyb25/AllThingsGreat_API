/*
Defines the controller endpoints and slug information for Articles. The endpoints are defined 
here and the router is registered for app use in app.js
*/

const express = require('express');
const router = express.Router();
const Article = require("../controllers/articles.controller");
const {jwtCheck} = require("../lib/auth.lib")
const {upload} = require("../lib/multer.lib")


router.get(`/category/:category/page/:page`, Article.getArticles);
router.get(`/writer`, Article.getAllArticles);
router.get(`/writer/:id`, Article.getArticlesByWriterId);
router.post(`/create`, jwtCheck, Article.create);
router.patch(`/update/:id`, jwtCheck, Article.update);
router.post(`/uploadImage/writer/:writerId`, [jwtCheck, upload.single("file")] , Article.uploadArticleImage)
router.get(`/getImageUrls/writer/:writerId`, jwtCheck, Article.getBucketUrls);
router.post(`/uploadProfileImage/writer/:writerId`, [jwtCheck, upload.single("file")] , Article.uploadProfileImage)
router.get('/test', Article.getArticleById)
router.post('/evaluate', jwtCheck, Article.evaluateArticle)
router.post('/game/analyze', jwtCheck, Article.analyzeMatchup)
router.patch('/:id/approve', jwtCheck, Article.approveArticle)
router.patch('/:id/unapprove', jwtCheck, Article.unApproveArticle)
router.patch('/:id/archive', jwtCheck, Article.archiveArticle)
router.patch('/:id/unarchive', jwtCheck, Article.unArchiveArticle)
router.get(`/slug/:slug`, Article.getArticleBySlug);
router.get(`/:id`, Article.getArticleById); //keep this route at the bottom...trust me



module.exports = router;