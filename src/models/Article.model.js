/*
Article model object

More information on Mongoose Model objects, including validation and much more, can be found in 
the documentation:

https://mongoosejs.com/docs/api.html
*/

const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({

    numComments: {
        type: 'number', default: 0
    },

    views: {
        type: 'number', default:0
    },

    rating: {
        type: 'number', default: 0
    },

    numberOfRatings: {
        type: 'number', default: 0
    },

    isArchived: {
        type: 'boolean', default:false
    },

    isReviewed: {
        type: 'boolean', default: false
    },

    title: {
        type: 'string', default: ""
    },

    bodyHTML: {
        type: 'string', default: ""
    },

    imageUrl: {
        type: 'string',
        default: ""
    },

    writer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Writer"
    },

    category: {
        type: 'string',
        default: "AllThingsGreat",
    },
    
    previewText: {
        type: 'string',
        default: '',
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

module.exports = mongoose.model("Article", articleSchema, 'article');