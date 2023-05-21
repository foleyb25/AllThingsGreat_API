/*
Service for Article DB Operations and more. The Service acts as the Worker and recieves tasks from the
Controller (Manager)  on what actions need to be performed. The Service returns this data back to the
controller. Services communicate directly to the DB via Mongoose.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const Article = require("../models/Article.model")

async function getMultiple(page = 1){
//   const offset = helper.getOffset(page, config.listPerPage);
    return await Article.find().limit(25);
}

async function getArticlesByWriterId(userId) {
    return await Article.find( {"writer": userId}).populate("writer").sort( {createdAt: -1})
}

async function getAllArticles() {
    return await Article.find().populate("writer").limit(25).sort( {createdAt: -1});
}

async function getArticles(category, page) {
    const limit = 25
    const skip = page * limit
    const filter = (category !== 'undefined') ? { category: category } : {};
    const articles = await Article.find(filter).populate("writer").skip(Number(skip)).limit(limit + 1).sort( {createdAt: -1});
    const hasNextPage = (articles.length > limit);
    if (hasNextPage) articles.pop();
    return {
        articles: articles,
        hasMore: hasNextPage
    };
}

async function getSingle(id) {
    return await Article.findById(id).populate("writer");
}

async function getSingleSlug(slug) {
    return await Article.findOne({slug: slug}).populate("writer");
}

async function create(article){
    return await Article.create(article);
}

async function update(id, newArticle){
    return await Article.findByIdAndUpdate(id, newArticle);
}

async function remove(id){
    return await Article.findByIdAndDelete(id)
}

async function approveArticle(id) {
    return await Article.findByIdAndUpdate(id, {isReviewed: true})
}

async function unApproveArticle(id) {
    return await Article.findByIdAndUpdate(id, {isReviewed: false})
}

async function archiveArticle(id) {
    return await Article.findByIdAndUpdate(id, {isArchived: true})
}

async function unArchiveArticle(id) {
    return await Article.findByIdAndUpdate(id, {isArchived: false})
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
    unArchiveArticle,
    getSingleSlug,
    getArticles
}