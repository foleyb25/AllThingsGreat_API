/*
Service for Article DB Operations and more. The Service acts as the Worker and recieves tasks from the
Controller (Manager)  on what actions need to be performed. The Service returns this data back to the
controller. Services communicate directly to the DB via Mongoose.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const Article = require("../models/Article.model")
const fileUploader = require("../utils/AWS.helper")
// const db = require('./db.service');
// const helper = require('../utils/helper.util');
// const config = require('../configs/general.config');

async function getMultiple(page = 1){
//   const offset = helper.getOffset(page, config.listPerPage);
  const articles = await Article.find().limit(25);
  return articles
}

async function getArticlesByWriterId(userId) {
    return await Article.find( {"writer": userId}).populate("writer").sort( {createdAt: -1})
}

async function getAllArticles() {
    return await Article.find().populate("writer").limit(25).sort( {createdAt: -1});
}

async function getSingle(id) {
    const article = await Article.findById(id)
        .populate("writer");
    return article
}

async function create(article){
    const result = await Article.create(article);
    return result
}

async function update(id, newArticle){
    const result = await Article.findByIdAndUpdate(id, newArticle);
    return result
}

async function remove(id){
    const result = await Article.findByIdAndDelete(id)
    return result
}

async function approveArticle(id) {
    const result = await Article.findByIdAndUpdate(id, {isReviewed: true})
    return result
}

async function unApproveArticle(id) {
    const result = await Article.findByIdAndUpdate(id, {isReviewed: false})
    return result
}

async function archiveArticle(id) {
    const result = await Article.findByIdAndUpdate(id, {isArchived: true})
    return result
}

async function unArchiveArticle(id) {
    const result = await Article.findByIdAndUpdate(id, {isArchived: false})
    return result
}

module.exports = {
    getMultiple,
    getSingle,
    create,
    update,
    remove,
    getArticlesByWriterId,
    getAllArticles,
    approveArticle,
    unApproveArticle,
    archiveArticle,
    unArchiveArticle
}