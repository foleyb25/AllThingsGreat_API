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

/**
 * @swagger
 * /api/v2/screenplays/{pageNum}/{searchString}:
 *  get:
 *      summary: Get Screenplays with pagination
 *      description: Get Screenplays based on page number and query
 *      parameters:
 *        - in: path
 *          name: pageNum
 *          required: true
 *          description: PageNum
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              description: OK
 * 
 */
async function searchScreenplays(req, res) {
    const pageNum = req.params.pageNum
    const searchString = req.params.searchString
    const screenplays = await screenplayService.getMultipleSearch(searchString, pageNum)
    return res.status(200).json(screenplays)
}

module.exports = autoCatch({
    searchScreenplays,
})