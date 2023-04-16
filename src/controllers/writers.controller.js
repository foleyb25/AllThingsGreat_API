/*
Controller for Writer CRUD Operations and more. The Controller acts as the Manager and tells the
service (Worker) what actions need to be performed. The Service returns data back to the controller.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const autoCatch = require("../lib/auto_catch.lib")
const AppError = require("../lib/app_error.lib");
const { ERROR_400, ERROR_500, OK_CREATED } = require('../lib/constants.lib');
const writerService = require("../services/writers.service.js")
const sanitizeHtml = require('sanitize-html')

async function getWriterByAuthID(req,res) {
    const id = req.params.authID;
    const response = await writerService.getSingleByAuthId(id);
    return res.status(200).json({data: response, message:"Successfully retrieved writer by auth0 id"});
}

async function create(req,res) {
    const writer = req.body;
    const response = await writerService.create(writer)
    return res.status(201).json({data: response, message:"Successfully createdWriter"})
}

async function update(req,res) {
    const newWriter = req.body
    const id = req.body.auth0Id
    const response = await writerService.update(id, newWriter)
    return res.status(200).json({data: response, message:"Successfully updated writer"})
}

async function saveDraft(req, res) {
    const draftData = req.body
    // draftData.bodyHTML = sanitizeHtml(he.decode(draftData.bodyHTML))
    const writerId = req.params.id
    const response = await writerService.saveDraft(writerId, draftData)
    return res.status(200).json({data: response, message:"Successfully save draft"})
}

async function deleteDraft(req, res) {
    const draftId = req.params.draftId
    const writerId = req.params.writerId
    // draftData.bodyHTML = sanitizeHtml(he.decode(draftData.bodyHTML))
    const response = await writerService.deleteDraft(writerId, draftId)
    return res.status(200).json({data: response, message:"Successfully deleted draft"})
}

module.exports = autoCatch({
    create,
    update,
    getWriterByAuthID,
    saveDraft,
    deleteDraft,
})