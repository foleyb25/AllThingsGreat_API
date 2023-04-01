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

async function getUserByAuthID(req,res) {
    const id = req.params.authID;
    const data = await writerService.getSingleByAuthId(id);
    return res.status(200).json(data);
}

async function create(req,res) {
    const writer = req.body;
    const status = await writerService.create(writer)
    return res.status(201).json({message: "Writer created successfully!", _id: status._doc._id})
}

async function update(req,res) {
    const newWriter = req.body
    const id = req.body.auth0Id
    await writerService.update(id, newWriter)
    return res.status(200).json({message: "Writer Updated Successfully"})
}

async function saveDraft(req, res) {
    const draftData = req.body
    // draftData.bodyHTML = sanitizeHtml(he.decode(draftData.bodyHTML))
    const writerId = req.params.id
    const draft = await writerService.saveDraft(writerId, draftData)
    return res.status(200).json({draft: draft, message: "Draft Saved Successfully"})
}

async function deleteDraft(req, res) {
    const draftId = req.params.draftId
    const writerId = req.params.writerId
    // draftData.bodyHTML = sanitizeHtml(he.decode(draftData.bodyHTML))
    const draft = await writerService.deleteDraft(writerId, draftId)
    return res.status(200).json({draftId: draft, message: `Draft with id ${draftId} successfully deleted`})
}

module.exports = autoCatch({
    create,
    update,
    getUserByAuthID,
    saveDraft,
    deleteDraft,
})