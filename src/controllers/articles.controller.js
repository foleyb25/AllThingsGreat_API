/*
Controller for Article CRUD Operations and more. The Controller acts as the Manager and tells the
service (Worker) what actions need to be performed. The Service returns data back to the controller.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const autoCatch = require("../lib/auto_catch.lib")
const AppError = require("../lib/app_error.lib");
const { ERROR_400, ERROR_500, OK_CREATED } = require('../lib/constants.lib');
const articleService = require("../services/articles.service.js")
const {uploadFile, getImageUrls} = require("../utils/AWS.helper")
const he = require('he')
const sanitizeHtml = require('sanitize-html')

async function uploadArticleImage(req,res) {
    const file = req.file
    uploadFile(file).then( (data) => {
        return res.status(200).json({message: "Image Successfully Uploaded"})
    }).catch( (err) => {
        throw new AppError("Error uploading image ", err.message)
    })
}

async function getBucketUrls(req,res) {

    getImageUrls()
    .then( (imageUrls) => {
        return res.status(200).json(imageUrls)
    }).catch( (err) => {
        throw new AppError("Error getting image urls ", err.message)
    })
    
}

async function create(req,res) {
    const article = req.body
    // article.bodyHTML = sanitizeHtml(he.decode(article.bodyHTML))
    const response = await articleService.create(article)
    return res.status(200).json(response)
}

async function update(req,res) {
    const article = req.body
    const id = req.params.id
    // article.bodyHTML = sanitizeHtml(he.decode(article.bodyHTML))
    const response = await articleService.update(id, article)
    return res.status(204).json(response)
}

// /api/v2/articles/
async function getAll(req,res) {

}

// /api/v2/articles/:id
async function getArticleById(req,res) {
    const articleId = req.params.id
    const response = await articleService.getSingle(articleId)
    return res.status(200).json(response)

}

// /api/v2/articles/user/:id
async function getArticlesByWriterId(req,res) {
    const userId = req.params.id
    const response = await articleService.getArticlesByWriterId(userId)
    return res.status(200).json(response)
}

module.exports = autoCatch({
    uploadArticleImage,
    getBucketUrls,
    create,
    update,
    getArticlesByWriterId,
    getArticleById
})