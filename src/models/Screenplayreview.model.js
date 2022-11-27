/*
Screenplayreview model object

More information on Mongoose Model objects, including validation and much more, can be found in 
the documentation:

https://mongoosejs.com/docs/api.html
*/

const mongoose = require('mongoose');

const screenplayreviewSchema = mongoose.Schema({
     writer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Writer',
     },

     screenplay: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Screenplay',
     },

     score: {
          type: 'number'
     },

     article_url: {
          type: 'string'
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

module.exports = mongoose.model("Screenplayreview", screenplayreviewSchema, 'screenplayreview');