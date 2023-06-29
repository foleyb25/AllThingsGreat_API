/*
Service for Screenplayreview DB Operations and more. The Service acts as the Worker and recieves tasks from the
Controller (Manager)  on what actions need to be performed. The Service returns this data back to the
controller. Services communicate directly to the DB via Mongoose.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const Screenplayreview = require("../models/Screenplayreview.model");
// const db = require('./db.service');
// const helper = require('../utils/helper.util');
// const config = require('../configs/general.config');

async function getMultiple(page = 25) {
  //   const offset = helper.getOffset(page, config.listPerPage);
  const screenplayreviews = await Screenplayreview.find().limit(page);
  return screenplayreviews;
}

async function getSingle(id) {
  const screenplayreview = await Screenplayreview.findById(id).populate(
    "writer"
  );
  return screenplayreview;
}

async function create(screenplayreview) {
  const result = await Screenplayreview.create(screenplayreview);
  return result;
}

async function update(id, newScreenplayreview) {
  const result = await Screenplayreview.findByIdAndUpdate(
    id,
    newScreenplayreview
  );
  return result;
}

async function remove(id) {
  const result = await Screenplayreview.findByIdAndDelete(id);
  return result;
}

module.exports = {
  getMultiple,
  getSingle,
  create,
  update,
  remove,
};
