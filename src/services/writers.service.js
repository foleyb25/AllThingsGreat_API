/*
Service for Article DB Operations and more. The Service acts as the Worker and recieves tasks from the
Controller (Manager)  on what actions need to be performed. The Service returns this data back to the
controller. Services communicate directly to the DB via Mongoose.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const Writer = require("../models/Writer.model");
// const db = require('./db.service');
// const helper = require('../utils/helper.util');
// const config = require('../configs/general.config');

async function getMultiple(page = 25) {
  //   const offset = helper.getOffset(page, config.listPerPage);
  return await Writer.find().limit(page);
}

async function saveDraft(writerId, body) {
  const writer = await Writer.findOneAndUpdate(
    {
      _id: writerId,
    },
    {
      $push: { drafts: body },
    },
    { new: true }
  );
  // const updatedWriter = await Writer.findById(writer._id);
  // get id of most recent draft created
  body._id = writer.drafts[writer.drafts.length - 1]._id;
  return body;
}

async function deleteDraft(writerId, draftId) {
  return await Writer.updateOne(
    { _id: writerId },
    { $pull: { drafts: { _id: draftId } } }
  );
}

async function getSingleByAuthId(id) {
  return await Writer.findOne({ auth0Id: id });
}

async function create(writer) {
  return await Writer.create(writer);
}

async function update(id, newWriter) {
  return await Writer.findOneAndUpdate({ auth0Id: id }, newWriter, {
    new: true,
  });
}

async function remove(id) {
  return await Writer.findByIdAndDelete(id);
}

module.exports = {
  getMultiple,
  create,
  update,
  remove,
  getSingleByAuthId,
  saveDraft,
  deleteDraft,
};
