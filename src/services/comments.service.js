/*
Service for Comment DB Operations and more. The Service acts as the Worker and recieves tasks from the
Controller (Manager)  on what actions need to be performed. The Service returns this data back to the
controller. Services communicate directly to the DB via Mongoose.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const Comment = require("../models/Comment.model");
// const db = require('./db.service');
// const helper = require('../utils/helper.util');
// const config = require('../configs/general.config');

async function getMultiple(page = 25) {
  //   const offset = helper.getOffset(page, config.listPerPage);
  const comments = await Comment.find().limit(page);
  return comments;
}

async function getSingle(id) {
  const comment = await Comment.findById(id).populate("writer");
  return comment;
}

async function create(comment) {
  const result = await Comment.create(comment);
  return result;
}

async function update(id, newComment) {
  const result = await Comment.findByIdAndUpdate(id, newComment);
  return result;
}

async function remove(id) {
  const result = await Comment.findByIdAndDelete(id);
  return result;
}

module.exports = {
  getMultiple,
  getSingle,
  create,
  update,
  remove,
};
