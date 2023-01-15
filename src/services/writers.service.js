/*
Service for Article DB Operations and more. The Service acts as the Worker and recieves tasks from the
Controller (Manager)  on what actions need to be performed. The Service returns this data back to the
controller. Services communicate directly to the DB via Mongoose.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const Writer = require("../models/Writer.model")
// const db = require('./db.service');
// const helper = require('../utils/helper.util');
// const config = require('../configs/general.config');

async function getMultiple(page = 1){
//   const offset = helper.getOffset(page, config.listPerPage);
  const writers = await Writer.find().limit(25);
  return writers
}

async function getSingleByAuthId(id) {
    const writer = await Writer.findOne({auth0Id: id})
    return writer
}

async function create(writer){
    const result = await Writer.create(writer);
    return result
}

async function update(id, newWriter){
    const result = await Writer.findOneAndUpdate({auth0Id: id}, newWriter);
    return result
}

async function remove(id){
    const result = await Writer.findByIdAndDelete(id)
    return result
}

module.exports = {
  getMultiple,
  create,
  update,
  remove,
  getSingleByAuthId
}