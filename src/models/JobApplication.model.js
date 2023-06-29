/*
User model object

More information on Mongoose Model objects, including validation and much more, can be found in
the documentation:

https://mongoosejs.com/docs/api.html
*/

const mongoose = require("mongoose");

const jobApplicationSchema = mongoose.Schema(
  {
    fullName: {
      type: "string",
      default: "",
    },

    email: {
      type: "string",
      default: "",
    },

    bio: {
      type: "string",
      default: "",
    },

    resumeUrl: {
      type: "string",
      default: "",
    },

    createdAt: {
      type: "number",
      default: Date.now(),
    },

    updatedAt: {
      type: "number",
      default: Date.now(),
    },
  },
  {
    versionKey: false, // Version key is a Mongoose integration which saves version number to the DB
    // by default. Set false here to disable this functionality.
  }
);

module.exports = mongoose.model("jobapplication", jobApplicationSchema);
