/*
Controller for Watchservice CRUD Operations and more. The Controller acts as the Manager and tells the
service (Worker) what actions need to be performed. The Service returns data back to the controller.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const autoCatch = require("../lib/auto_catch.lib")
const AppError = require("../lib/app_error.lib");
const { ERROR_400, ERROR_500, OK_CREATED } = require('../lib/constants.lib');
const watchserviceService = require("../services/watchservices.service.js")

    async function getAll(req,res) {
        const data = await watchserviceService.getMultiple(0);
        return res.status(200).json(data);
    }

    async function getById(req,res) {
        const id = req.params.id;
        const watchservice = await watchserviceService.getSingle(id)
        return res.status(200).json(watchservice);
    }

    async function create(req,res) {
        const watchservice = req.body;
        const status = await watchserviceService.create(watchservice)
        return res.status(201).json({message: "watchservice created successfully!"})
    }

    async function update(req,res) {
        const newwatchservice = req.body
        const status = await watchserviceService.update(id, newwatchservice)
        return res.status(200).json({message: "watchservice Updated Successfully"})
    }

    // async function remove(req,res) {
    //     const id = req.params.id;
    //     try {
    //         const status = await watchserviceService.remove(id)
    //         res.status(200).json({message: "watchservice deleted succesfully"})
    //     } catch(err) {
    //         res.status(404).json({message: "There was an error deleting watchservice"})
    //     }
    // }

module.exports = autoCatch({
    getAll,
    getById,
    create,
    update,
    // remove
})