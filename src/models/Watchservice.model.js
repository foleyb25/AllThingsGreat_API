/*
Watchservice model object

More information on Mongoose Model objects, including validation and much more, can be found in 
the documentation:

https://mongoosejs.com/docs/api.html
*/

const mongoose = require('mongoose');

const watchserviceSchema = mongoose.Schema({
    tmdb_provider_id: {
        type: 'number'
    },

    name: {
        type: 'string'
    },

    watch_url: {
        type: 'string'
    },

    monetizationType: {
        type: 'string'
    },

    price: {
        type: 'number'
    },

    logo_url: {
        type: 'string'
    },

    screenplay: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Screenplay'
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

module.exports = mongoose.model("Watchservice", watchserviceSchema, 'watchservice');