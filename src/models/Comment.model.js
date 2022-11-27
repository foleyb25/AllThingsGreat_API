/*
Comment model object

More information on Mongoose Model objects, including validation and much more, can be found in 
the documentation:

https://mongoosejs.com/docs/api.html
*/

const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    text: {
        type: 'string', default: ""
    },

    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    reply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },

    upVotes: {
        type: 'number', defaultsTo: 0,
    },

    downVotes: {
        type: 'number', defaultsTo: 0,
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

module.exports = mongoose.model("Comment", commentSchema, 'comment');