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

/**
 * @swagger
 * /api/v2/writers/authID/{authID}:
 *  get:
 *      summary: Get all screenplay reviews
 *      description: Get all screenplay reviews from Database
 *      parameters:
 *        - in: path
 *          name: authID
 *          required: true
 *          description: String representation of users Auth ID
 *          schema:
 *            type: string
 *      responses:
 *          200:
 *              description: OK
 * 
 */
async function getUserByAuthID(req,res) {
    const id = req.params.authID;
    const data = await writerService.getSingleByAuthId(id);
    return res.status(200).json(data);
}

/**
 * @swagger
 * /api/v2/writers:
 *  post:
 *      summary: Create a new writer
 *      description: Create a new writer and store in the database
 *      requestBody:
 *            required: true
 *            description: writer data in json object
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          auth0_id:
 *                              type: string
 *                              example: ""
 *                          bio:
 *                              type: string
 *                              example: bio
 *                          instagram_link:
 *                              type: string
 *                              example: ""
 *                          twitter_lin:
 *                              type: string
 *                              example: bio
 *                          snapchat_link:
 *                              type: string
 *                              example: ""
 *                          tiktok_link:
 *                              type: string
 *                              example: bio
 *                          profile_image_url:
 *                              type: string
 *                              example: ""
 *                          full_name:
 *                              type: string
 *                              example: bio
 *                          nick_name:
 *                              type: string
 *                              example: ""
 *                          is_super_admin:
 *                              type: string
 *                              example: false
 *                          last_seen_at:
 *                              type: string
 *                              example: ""
 *                          is_archived:
 *                              type: string
 *                              example: false
 *                          created_at:
 *                              type: number
 *                              example: 231243423525
 *                          updatedAt:
 *                              type: number
 *                              example: 1232443463453
 *                          
 *                          
 *      responses:
 *          200:
 *              description: OK
 * 
 */
async function create(req,res) {
    const writer = req.body;
    const status = await writerService.create(writer)
    return res.status(201).json({message: "Writer created successfully!", _id: status._doc._id})
}

/**
 * @swagger
 * /api/v2/writers:
 *  patch:
 *      summary: Update writer profile info
 *      description: Update writer by searching their auth0_id
 *      requestBody:
 *            required: true
 *            description: writer data in json object
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          auth0_id:
 *                              type: string
 *                              example: ""
 *                          bio:
 *                              type: string
 *                              example: bio
 *                          instagram_link:
 *                              type: string
 *                              example: ""
 *                          twitter_lin:
 *                              type: string
 *                              example: bio
 *                          snapchat_link:
 *                              type: string
 *                              example: ""
 *                          tiktok_link:
 *                              type: string
 *                              example: bio
 *                          profile_image_url:
 *                              type: string
 *                              example: ""
 *                          full_name:
 *                              type: string
 *                              example: bio
 *                          nick_name:
 *                              type: string
 *                              example: ""
 *                          is_super_admin:
 *                              type: string
 *                              example: false
 *                          last_seen_at:
 *                              type: string
 *                              example: ""
 *                          is_archived:
 *                              type: string
 *                              example: false
 *                          created_at:
 *                              type: number
 *                              example: 231243423525
 *                          updatedAt:
 *                              type: number
 *                              example: 1232443463453
 *                          
 *                          
 *      responses:
 *          200:
 *              description: OK
 * 
 */
async function update(req,res) {
    const newWriter = req.body
    const id = req.body.auth0_id
    await writerService.update(id, newWriter)
    return res.status(200).json({message: "Writer Updated Successfully"})
}

module.exports = autoCatch({
    create,
    update,
    getUserByAuthID
})