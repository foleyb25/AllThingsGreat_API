/*
Controller for Comment CRUD Operations and more. The Controller acts as the Manager and tells the
service (Worker) what actions need to be performed. The Service returns data back to the controller.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const autoCatch = require("../lib/auto_catch.lib")
const AppError = require("../lib/app_error.lib");
const { ERROR_400, ERROR_500, OK_CREATED } = require('../lib/constants.lib');
const commentService = require("../services/comments.service.js")

    async function getAll(req,res) {
        const data = await commentService.getMultiple(0);
        return res.status(200).json(data);
    }

    async function getById(req,res) {
        const id = req.params.id;
        const comment = await commentService.getSingle(id)
        return res.status(200).json(comment);
    }

    async function create(req,res) {
        const comment = req.body;
        const status = await commentService.create(comment)
        return res.status(201).json({message: "Comment created successfully!"})
    }

    async function update(req,res) {
        const newComment = req.body
        const status = await commentService.update(id, newComment)
        return res.status(200).json({message: "Comment Updated Successfully"})
    }

    // async function remove(req,res) {
    //     const id = req.params.id;
    //     try {
    //         const status = await commentService.remove(id)
    //         res.status(200).json({message: "Comment deleted succesfully"})
    //     } catch(err) {
    //         res.status(404).json({message: "There was an error deleting Comment"})
    //     }
    // }

module.exports = autoCatch({
    getAll,
    getById,
    create,
    update,
    // remove
})