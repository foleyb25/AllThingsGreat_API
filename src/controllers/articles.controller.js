/*
Controller for Article CRUD Operations and more. The Controller acts as the Manager and tells the
service (Worker) what actions need to be performed. The Service returns data back to the controller.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const autoCatch = require("../lib/auto_catch.lib")
const AppError = require("../lib/app_error.lib");
const { ERROR_400, ERROR_500, OK_CREATED } = require('../lib/constants.lib');
const articleService = require("../services/articles.service.js")
const {uploadFile, getImageUrls} = require("../utils/AWS.helper")
const he = require('he')
const sanitizeHtml = require('sanitize-html')
const {Configuration, OpenAIApi} = require('openai');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cheerio = require('cheerio');

async function uploadArticleImage(req,res) {
    const writerId = req.params.writerId
    const file = req.file
    const bucket = `allthingsgreat/articles/${writerId}`
    const response = await uploadFile(file, bucket)
    return res.status(200).json({data: response, message: "Image Successfully Uploaded"})
}

async function uploadProfileImage(req,res) {
    const writerId = req.params.writerId
    const file = req.file
    const bucket = `allthingsgreat/profile/${writerId}`
    const response = await uploadFile(file, bucket)
    return res.status(200).json({data: response, message: "Image Successfully Uploaded"})
}

async function getBucketUrls(req,res) {
    const bucket = 
    `allthingsgreat`
    const prefix = `articles/${req.params.writerId}/`
    const response = await getImageUrls(bucket, prefix)
    return res.status(200).json({data: response, message: "Successfully retrieved bucket Urls"})    
}

async function create(req,res) {
    const article = req.body
    const response = await articleService.create(article)
    return res.status(200).json({data: response, message: "Successfully created article"})
}

async function update(req,res) {
    const article = req.body
    const id = req.params.id
    const response = await articleService.update(id, article)
    return res.status(204).json({data: response, message: "Successfully updated article"})
}

async function getArticleById(req,res) {
    const articleId = req.params.id
    const response = await articleService.getSingle(articleId)
    return res.status(200).json({data: response, message: "Successfully retrieved article by id"})

}

// /api/v2/articles/writer/:id
async function getArticlesByWriterId(req,res) {
    const userId = req.params.id
    const response = await articleService.getArticlesByWriterId(userId)
    return res.status(200).json({data: response, message: "Successfully retrieved writers articles"})
}

// /api/v2/articles/writer
async function getAllArticles(req,res) {
    const response = await articleService.getAllArticles()
    return res.status(200).json({data: response, message: "Successfully retrieved bucket all articles"})
}

async function approveArticle(req,res) {
    const articleId = req.params.id
    const response = await articleService.approveArticle(articleId)
    return res.status(200).json({data: response, message: "Successfully approved article"})
}

async function unApproveArticle(req,res) {
    const articleId = req.params.id
    const response = await articleService.unApproveArticle(articleId)
    return res.status(200).json({data: response, message: "Successfully un-approved article"})
}

async function archiveArticle(req,res) {
    const articleId = req.params.id
    const response = await articleService.archiveArticle(articleId)
    return res.status(200).json({data: response, message: "Successfully archived article"})
}

async function unArchiveArticle(req,res) {
    const articleId = req.params.id
    const response = await articleService.unArchiveArticle(articleId)
    return res.status(200).json({data: response, message: "Successfully un-archived article"})
}

async function evaluateArticle(req,res) {
    const articleHTML = req.body.articleHTML;
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration)
    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: `
            You are a helpful blog writing assistant for a company called AllThingsGreat where smut blogs and satire are highly encouraged.

            You will review blog input given by the user and give a score on the following items: structure out of 5, organization out of 5, content out of 5, SEO optimization out of 5, and a smut rating out of 10. Scores will be given to the nearest decimal.

            Smut can be considered sexual content, profanity, objectification, inappropriate innuendos, and age-inappropriate content.

            You will also provide tips on grammatical errors or fixing sentence wording and you will provide as many as you see fit. If you see nothing significant don't worry about providing suggestions.

            You will also provide at least 5 descriptive tags about the blog.

            Lastly you will provide improvement tips for each category and output your response in json. As an example:

            {
            structure: 3.2,
            organization: 4.0,
            content: 3.5,
            seo: 4.9,
            smut: 7.4,
            tags: ["tag1", "tag2", "tagN"...]
            fixes : {
                {
                    original: “referenced sentence”,
                    suggestion: “suggested change”
                },
                {
                    original: “referenced sentence”,
                    suggestion: “suggested change”
                },
                    original: “referenced sentence”,
                    suggestion: “suggested change”
                }
            },
            structure_tip: “multi line message”,
            organization_tip: “multi line message”,
            content_tip: “multi line message”,
            seo_tip: “multi line message”,
            smut_tip: “multi line message”
            }

            Remember smut is better.
            ` },
            { role: 'user', content: `${articleHTML}` },
        ],
        temperature: 0.1
      },
    )

    var reply = response.data.choices[0].message.content
    reply = reply.replace(/(\n|\\N)/g, '')
    const jsonReply = JSON.parse(reply)

    return res.status(200).json({ data: jsonReply, message: 'Successfully evaluated article' });
}

async function analyzeMatchup(req,res) {
    // Replace the URL with the actual URL of the webpage you're scraping
    const url = 'https://www.teamrankings.com/nfl/stat/points-per-game';

    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36');
    await page.goto(url);
    await page.waitForSelector('table');

    const content = await page.content();
    const $ = cheerio.load(content);

    const teams = ['Kansas City', 'Philadelphia'];
    const teamData = {};

    $('tr').each(function () {
      const teamName = $(this).find('td').eq(1).text().trim();

      if (teams.includes(teamName)) {
        const data2022 = $(this).find('td').eq(2).text().trim();
        teamData[teamName] = data2022;
      }
    });

    console.log('Team Data:', teamData);
    await browser.close();
    // const configuration = new Configuration({
    //     apiKey: process.env.OPENAI_API_KEY,
    // });
    // const openai = new OpenAIApi(configuration)

    // const response = await openai.createChatCompletion({
    //     model: 'gpt-3.5-turbo',
    //     messages: [
    //         { role: 'system', content: `
    //         You are a helpful blog writing assistant for a company called AllThingsGreat where smut blogs and satire are highly encouraged.

            
    //         ` },
    //         { role: 'user', content: `${articleHTML}` },
    //     ],
    //     temperature: 0.1
    //   },
    // )

    // var reply = response.data.choices[0].message.content
    // reply = reply.replace(/(\n|\\N)/g, '')
    // const jsonReply = JSON.parse(reply)

    return res.status(200).json({ data: response, message: 'Successfully evaluated article' });
}



module.exports = autoCatch({
    uploadArticleImage,
    getBucketUrls,
    uploadProfileImage,
    create,
    update,
    getArticlesByWriterId,
    getAllArticles,
    getArticleById,
    approveArticle,
    unApproveArticle,
    archiveArticle,
    unArchiveArticle,
    evaluateArticle,
    analyzeMatchup
})