/*
Controller for Screenplay CRUD Operations and more. The Controller acts as the Manager and tells the
service (Worker) what actions need to be performed. The Service returns data back to the controller.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const autoCatch = require("../lib/auto_catch.lib")
const AppError = require("../lib/app_error.lib");
const { ERROR_400, ERROR_500, OK_CREATED } = require('../lib/constants.lib');
const screenplayService = require("../services/screenplays.service.js")

    async function getAll(req,res) {
        const data = await screenplayService.getMultiple(0);
        return res.status(200).json(data);
    }

    async function getById(req,res) {
        const id = req.params.id;
        const screenplay = await screenplayService.getSingle(id)
        return res.status(200).json(screenplay);
    }

    async function searchScreenplays(req, res) {
        const pageNum = req.params.pageNum
        const searchString = req.params.searchString
        const screenplays = await screenplayService.getMultipleSearch(searchString, pageNum)
        return res.status(200).json(screenplays)
    }

    async function create(req,res) {
        const screenplay = req.body;
        const status = await screenplayService.create(screenplay)
        return res.status(201).json({message: "screenplay created successfully!"})
    }

    async function update(req,res) {
        const newscreenplay = req.body
        const status = await screenplayService.update(id, newscreenplay)
        return res.status(200).json({message: "screenplay Updated Successfully"})
    }

    // async function remove(req,res) {
    //     const id = req.params.id;
    //     try {
    //         const status = await screenplayService.remove(id)
    //         res.status(200).json({message: "screenplay deleted succesfully"})
    //     } catch(err) {
    //         res.status(404).json({message: "There was an error deleting screenplay"})
    //     }
    // }

module.exports = autoCatch({
    getAll,
    getById,
    create,
    update,
    searchScreenplays,
    // remove
})