const Queue = require('bull');
const { openai_evaluateArticle } = require('./openai_api.lib');
const CustomLogger = require('./customLogger.lib');
const logger = new CustomLogger();
const articleService = require("../services/articles.service.js")
const slugify = require('slugify'); // or whatever the correct import is
const { calculateEstimatedReadTime } = require('./helper.lib'); // replace with the correct file path


// create a new queue
const evaluateQueue = new Queue('evaluateArticle', process.env.REDIS_URL);
const updateQueue = new Queue('updateArticle', process.env.REDIS_URL);
const createQueue = new Queue('createArticle', process.env.REDIS_URL);

// process jobs in the queue
evaluateQueue.process(async (job) => {
  try {
    logger.info(`processing job, ${job.id}`);
    const result = await openai_evaluateArticle(job.data.articleText);
    return result;
  } catch (error) {
    logger.error(`error processing job ${job.id}: ${error.message}`);
    throw error;
  }
});

// handle job completion
evaluateQueue.on('global:completed', (jobId, result) => {
  console.log(`Job completed with result ${result} for job ID ${jobId}`);
});

evaluateQueue.on('error', (error) => {
  console.error(`There was an error with the createQueue: ${error}`);
});

// process jobs in the queue
updateQueue.process(async (job) => {
  var articleText = job.data.articleText;
  var article = job.data.article;
  var id = job.data.id;

  let uniqueNumber = Math.floor(10000000 + Math.random() * 90000000)
  // Normalize the title by converting it to lowercase and replacing spaces with hyphens
  let slugTitle = slugify(article.title, {
      replacement: '-',  // replace spaces with replacement
      remove: /[*+~.()'"!:@]/g, // regex to remove characters
      lower: true  // result in lower case
  })
  article.slug = `${slugTitle}-${uniqueNumber}`

  if (process.env.NODE_ENV === 'production') {
        
    //updateQueue
    const openai_response = await openai_evaluateArticle(articleText)
    article.evaluation = openai_response
} else {
    article.evaluation = {
        structure: 4.5,
        organization: 3.4,
        content: 1.2,
        seo: 3.5,
        smut: 5.4,
        tags: ["test", "tags", "this is test"],
        fixes: [
            {
                original: "test",
                fix: "test"
            }
        ],
        structure_tip: "test structure tip",
        organization_tip: "test organization tip",
        content_tip: "test content tip",
        seo_tip: "test seo tip",
        smut_tip: "test smut tip",
    }
}

article.estimatedReadTime = Number(calculateEstimatedReadTime(articleText))

const response = await articleService.update(id, article)
return response
});

// handle job completion
updateQueue.on('global:completed', (jobId, result) => {
  console.log(`Job completed with result ${result} for job ID ${jobId}`);
});

updateQueue.on('error', (error) => {
  console.error(`There was an error with the createQueue: ${error}`);
});

// process jobs in the queue
createQueue.process(async (job) => {
  logger.info('INFO: Creating article...');
  let uniqueNumber = Math.floor(10000000 + Math.random() * 90000000)
  // Normalize the title by converting it to lowercase and replacing spaces with hyphens
  let slugTitle = slugify(job.data.article.title, {
      replacement: '-',  // replace spaces with replacement
      remove: /[*+~.()'"!:@]/g, // regex to remove characters
      lower: true  // result in lower case
  })
  logger.info('Setting Slug...');
  job.data.article.slug = `${slugTitle}-${uniqueNumber}`
  console.log("ENV: ", process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'production') {
      const openai_response = await openai_evaluateArticle(job.data.articleText)
      job.data.article.evaluation = openai_response
  } else {
    job.data.article.evaluation = {
          structure: 4.5,
          organization: 3.4,
          content: 1.2,
          seo: 3.5,
          smut: 5.4,
          tags: ["test", "tags", "this is test"],
          fixes: [
              {
                  original: "test",
                  fix: "test"
              }
          ],
          structure_tip: "test structure tip",
          organization_tip: "test organization tip",
          content_tip: "test content tip",
          seo_tip: "test seo tip",
          smut_tip: "test smut tip",
      }
  }
  job.data.article.estimatedReadTime = Number(calculateEstimatedReadTime(job.data.articleText))

  const response = await articleService.create(job.data.article)
  return response
});

// handle job completion
createQueue.on('global:completed', (jobId, result) => {
  console.log(`Job completed with result ${result} for job ID ${jobId}`);
});

createQueue.on('error', (error) => {
  console.error(`There was an error with the createQueue: ${error}`);
});

module.exports = { evaluateQueue, updateQueue, createQueue };