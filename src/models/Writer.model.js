/*
Writer model object

More information on Mongoose Model objects, including validation and much more, can be found in 
the documentation:

https://mongoosejs.com/docs/api.html
*/

const mongoose = require('mongoose');

const writerSchema = mongoose.Schema({
    
    auth0Id: {
        type: 'string',
        defaults: '',
        required: true,
        unique: true,
    },

    bio: {
        type: 'string',
        default: '',
    },

    social: [
        {}
    ],

    profileImageUrl: {
        type: 'string',
        default: ''
    },

    fullName: {
        type: 'string',
        default: '',
    },

    nickName: {
        type: 'string',
        default: '',
    },

    isSuperAdmin: {
        type: 'boolean',
        default: false,
    },

    isArchived: {
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
    versionKey: false // Version key is a Mongoose integration which saves version number to the DB 
    //by default. Set false here to disable this functionality.
}
)

module.exports = mongoose.model("writers", writerSchema);