/*
Article model object

More information on Mongoose Model objects, including validation and much more, can be found in 
the documentation:

https://mongoosejs.com/docs/api.html
*/

const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({

    rating: {
        type: 'number', 
        default: 0
    },

    numberOfRatings: {
        type: 'number', 
        default: 0
    },

    isArchived: {
        type: 'boolean', 
        default:false
    },

    isReviewed: {
        type: 'boolean', 
        default: false
    },

    title: {
        type: 'string', 
        required: true
    },

    bodyHTML: {
        type: 'string', 
        required: true
    },

    imageUrl: {
        type: 'string', 
        required: true
    },

    writer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "writers",
        required: true
    },

    category: {
        type: 'string', 
        default: "AllThingsGreat",
        required: true
        
    },

    tags: [],

    moods: [],

    isPinned: {
        type: 'boolean',
        default: false,
    },

    createdAt: { 
        type: 'number',
        default: Date.now()
    },

    updatedAt: { 
        type: 'number',
        default: Date.now()
    },
},
{
    versionKey: false, // Version key is a Mongoose integration which saves version number to the DB 
    //by default. Set false here to disable this functionality.
})

module.exports = mongoose.model("articles", articleSchema);