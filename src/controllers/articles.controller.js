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

async function uploadArticleImage(req,res) {
    const file = req.file
    uploadFile(file).then( (data) => {
        return res.status(200).json({message: "Image Successfully Uploaded"})
    }).catch( (err) => {
        throw new AppError("Error uploading image ", err.message)
    })
}

/**
 * @swagger
 * /api/v2/articles/getImageUrls/{id}/:
 *  get:
 *      summary: Get Screenplays with pagination
 *      description: Get Screenplays based on page number and query
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: id of user
 *          schema:
 *            type: string
 *      responses:
 *          200:
 *              description: OK
 * 
 */
async function getBucketUrls(req,res) {
    const id = req.params.id
    getImageUrls(id)
    .then( (imageUrls) => {
        return res.status(200).json(imageUrls)
    }).catch( (err) => {
        throw new AppError("Error getting image urls ", err.message)
    })
    
}

module.exports = autoCatch({
    uploadArticleImage,
    getBucketUrls
})