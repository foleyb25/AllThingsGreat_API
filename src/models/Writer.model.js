/*
Writer model object

More information on Mongoose Model objects, including validation and much more, can be found in 
the documentation:

https://mongoosejs.com/docs/api.html
*/

const mongoose = require('mongoose');

const writerSchema = mongoose.Schema({

    reviews: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'screenplay.reviews',
        }
    ],
    
    auth0_id: {
        type: 'string',
        defaults: '',
        required: true,
        unique: true,
    },

    bio: {
        type: 'string',
        default: '',
    },

    instagram_link: {
        type: 'string',
        default: '',
    },

    twitter_link: {
        type: 'string',
        default: '',
    },

    snapchat_link: {
        type: 'string',
        default: '',
    },

    tiktok_link: {
        type: 'string',
        default: '',
    },

    profile_image_url: {
        type: 'string',
        default: '',
    },

    full_name: {
        type: 'string',
        default: '',
    },

    nick_name: {
        type: 'string',
        default: '',
    },

    is_super_admin: {
        type: 'boolean',
        default: false,
    },

    last_seen_at: {
        type: 'number',
        default: 0,
    },

    is_archived: {
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

module.exports = mongoose.model("Writer", writerSchema);