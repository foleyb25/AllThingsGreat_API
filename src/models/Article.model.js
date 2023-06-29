/*
Article model object

More information on Mongoose Model objects, including validation and much more, can be found in
the documentation:

https://mongoosejs.com/docs/api.html
*/

const mongoose = require("mongoose");

// Define the Comment schema
const commentSchema = mongoose.Schema({
  message: {
    type: String,
    // required: true
  },
  user: {
    type: String,
    // required: true
  },
  replies: {
    type: [this], // Here `this` is used to denote that `replies` is an array of `CommentSchema` instances
    default: [],
  },
});

const articleSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      default: 0,
    },

    numberOfRatings: {
      type: Number,
      default: 0,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    isReviewed: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      required: true,
    },

    bodyHTML: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "writers",
      required: true,
    },

    category: {
      type: String,
      default: "AllThingsGreat",
      required: true,
    },

    comments: {
      type: [commentSchema], // Array of comments
      default: [],
      required: false,
    },

    tags: [],

    moods: [],

    slug: {
      type: String,
      default: null,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Number,
      default: Date.now(),
    },

    updatedAt: {
      type: Number,
      default: Date.now(),
    },

    estimatedReadTime: {
      type: Number,
      default: 0,
    },

    evaluation: {
      type: Object,
      default: {},
    },
  },
  {
    versionKey: false, // Version key is a Mongoose integration which saves version number to the DB
    // by default. Set false here to disable this functionality.
  }
);

module.exports = mongoose.model("articles", articleSchema);
