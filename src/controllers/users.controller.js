/*
Controller for User CRUD Operations and more. The Controller acts as the Manager and tells the
service (Worker) what actions need to be performed. The Service returns data back to the controller.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const autoCatch = require("../lib/auto_catch.lib")
const AppError = require("../lib/app_error.lib");
const { ERROR_400, ERROR_500, OK_CREATED } = require('../lib/constants.lib');
const userService = require("../services/users.service.js")

    // async function getAll(req,res) {
    //     const data = await userService.getMultiple(0);
    //     return res.status(200).json(data);
    // }

    // async function getById(req,res) {
    //     const id = req.params.id;
    //     const user = await userService.getSingle(id)
    //     return res.status(200).json(user);
    // }

    // async function create(req,res) {
    //     const user = req.body;
    //     const status = await userService.create(user)
    //     return res.status(201).json({message: "user created successfully!"})
    // }

    // async function update(req,res) {
    //     const newuser = req.body
    //     const status = await userService.update(id, newuser)
    //     return res.status(200).json({message: "user Updated Successfully"})
    // }

    // async function remove(req,res) {
    //     const id = req.params.id;
    //     try {
    //         const status = await userService.remove(id)
    //         res.status(200).json({message: "user deleted succesfully"})
    //     } catch(err) {
    //         res.status(404).json({message: "There was an error deleting user"})
    //     }
    // }

module.exports = autoCatch({
    // getAll,
    // getById,
    // create,
    // update,
    // remove
})