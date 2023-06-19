/*
Service for User DB Operations and more. The Service acts as the Worker and recieves tasks from the
Controller (Manager)  on what actions need to be performed. The Service returns this data back to the
controller. Services communicate directly to the DB via Mongoose.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const User = require("../models/User.model")
const JobApplication = require("../models/JobApplication.model")
// const db = require('./db.service');
// const helper = require('../utils/helper.util');
// const config = require('../configs/general.config');

async function submitApplication(application) {
    const result = JobApplication.create(application)
    return result
}

async function getApplications() {
    const result = JobApplication.find()
    return result
}



async function getMultiple(page = 1){
//   const offset = helper.getOffset(page, config.listPerPage);
  const users = await User.find().limit(25);
  return users
}

async function getSingle(id) {
    const user = await User.findById(id)
        .populate("writer");
    return user
}

async function create(user){
    const result = await User.create(user);
    return result
}

async function update(id, newUser){
    const result = await User.findByIdAndUpdate(id, newUser);
    return result
}

async function remove(id){
    const result = await User.findByIdAndDelete(id)
    return result
}

module.exports = {
  submitApplication,
  getApplications,
  getMultiple,
  getSingle,
  create,
  update,
  remove
}