/*
User model object

More information on Mongoose Model objects, including validation and much more, can be found in 
the documentation:

https://mongoosejs.com/docs/api.html
*/

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    bio: {
        type: 'string'
      },
  
      profileImageUrl: {
        type: 'string'
      },
  
      ratedArticles: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
      },
  
      emailAddress: {
        type: 'string',
      },
  
      emailStatus: {
        type: 'string',
      },
  
      emailChangeCandidate: {
        type: 'string',
      },
  
      password: {
        type: 'string',
      },
  
      fullName: {
        type: 'string',
      },
  
      username: {
        type: 'string',
      },
  
      isSuperAdmin: {
        type: 'boolean',
      },
  
      passwordResetToken: {
        type: 'string',
      },
  
      passwordResetTokenExpiresAt: {
        type: 'number',
      },
  
      emailProofToken: {
        type: 'string',
      },
  
      emailProofTokenExpiresAt: {
        type: 'number',
      },
  
      stripeCustomerId: {
        type: 'string',
      },
  
      hasBillingCard: {
        type: 'boolean',
      },
  
      billingCardBrand: {
        type: 'string',
      },
  
      billingCardLast4: {
        type: 'string',
      },
  
      billingCardExpMonth: {
        type: 'string',
      },
  
      billingCardExpYear: {
        type: 'string',
      },
  
      tosAcceptedByIp: {
        type: 'string',
      },
  
      lastSeenAt: {
        type: 'number',
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

module.exports = mongoose.model("User", userSchema, 'user');