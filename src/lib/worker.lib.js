const Queue = require('bull');
const { openai_evaluateArticle } = require('./openai_api.lib');
const CustomLogger = require('./customLogger.lib');
const logger = new CustomLogger();

// create a new queue
const evaluateQueue = new Queue('evaluateArticle', process.env.REDIS_URL);

// process jobs in the queue
evaluateQueue.process(async (job) => {
  try {
    console.log("log: processing job")
    logger.info(`processing job, ${job.id}`);
    // const result = await openai_evaluateArticle(job.data.articleText);
    return job;
  } catch (error) {
    console.log("error: processing job")
    logger.error(`error processing job ${job.id}: ${error.message}`);
    throw error;
  }
});

// handle job completion
evaluateQueue.on('global:completed', (jobId, result) => {
  console.log(`Job completed with result ${result} for job ID ${jobId}`);
});

module.exports = { evaluateQueue };
