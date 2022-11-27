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
const fileUploader = require("../utils/fileUploader.helper")

async function uploadArticleImage(req,res) {
    const file = req.file
    fileUploader.uploadFile(file)
    return res.status(200).json({message: "Image Successfully Uploaded"})
}

module.exports = autoCatch({
    uploadArticleImage
})