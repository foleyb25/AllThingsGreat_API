/*
Service for Watchservice DB Operations and more. The Service acts as the Worker and recieves tasks from the
Controller (Manager)  on what actions need to be performed. The Service returns this data back to the
controller. Services communicate directly to the DB via Mongoose.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const Watchservice = require("../models/Watchservice.model")
// const db = require('./db.service');
// const helper = require('../utils/helper.util');
// const config = require('../configs/general.config');

async function getMultiple(page = 1){
//   const offset = helper.getOffset(page, config.listPerPage);
  const watchservices = await Watchservice.find().limit(25);
  return watchservices
}

async function getSingle(id) {
    const watchservice = await Watchservice.findById(id)
        .populate("writer");
    return watchservice
}

async function create(watchservice){
    const result = await Watchservice.create(watchservice);
    return result
}

async function update(id, newWatchservice){
    const result = await Watchservice.findByIdAndUpdate(id, newWatchservice);
    return result
}

async function remove(id){
    const result = await Watchservice.findByIdAndDelete(id)
    return result
}

module.exports = {
  getMultiple,
  getSingle,
  create,
  update,
  remove
}