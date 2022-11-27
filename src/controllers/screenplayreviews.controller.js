/*
Controller for Screenplayreviews CRUD Operations and more. The Controller acts as the Manager and tells the
service (Worker) what actions need to be performed. The Service returns data back to the controller.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const autoCatch = require("../lib/auto_catch.lib")
const AppError = require("../lib/app_error.lib");
const { ERROR_400, ERROR_500, OK_CREATED } = require('../lib/constants.lib');
const screenplayreviewService = require("../services/screenplayreviews.service.js")

    /**
     * @swagger
     * /api/v2/screenplayreviews:
     *  get:
     *      summary: Get all screenplay reviews
     *      description: Get all screenplay reviews from Database
     *      responses:
     *          200:
     *              description: OK
     * 
     */
    async function getAll(req,res) {
        const data = await screenplayreviewService.getMultiple(0);
        return res.status(200).json(data);
    }

    async function getById(req,res) {
        const id = req.params.id;
        const screenplayreview = await screenplayreviewService.getSingle(id)
        return res.status(200).json(screenplayreview);
    }

    async function create(req,res) {
        const screenplayreview = req.body;
        const status = await screenplayreviewService.create(screenplayreview)
        return res.status(201).json({message: "screenplayreview created successfully!"})
    }

    async function update(req,res) {
        const newscreenplayreview = req.body
        const status = await screenplayreviewService.update(id, newscreenplayreview)
        return res.status(200).json({message: "screenplayreview Updated Successfully"})
    }

    // async function remove(req,res) {
    //     const id = req.params.id;
    //     try {
    //         const status = await screenplayreviewService.remove(id)
    //         res.status(200).json({message: "screenplayreview deleted succesfully"})
    //     } catch(err) {
    //         res.status(404).json({message: "There was an error deleting screenplayreview"})
    //     }
    // }

module.exports = autoCatch({
    getAll,
    getById,
    create,
    update,
    // remove
})