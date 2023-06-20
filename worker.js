// worker.js
const { evaluateQueue } = require('./src/lib/jobQueue.lib');
const { openai_evaluateArticle } = require('./src/lib/openai_api.lib');
const CustomLogger = require('./src/lib/customLogger.lib');
const logger = CustomLogger()

evaluateQueue.process(async (job) => {
  try {
      console.log("log: processing job")
      logger.info(`processing job, ${job.id}`);
      const result = await openai_evaluateArticle(job.data.articleText);
      return result;
  } catch (error) {
      console.log("error: processing job")
      logger.error(`error processing job ${job.id}: ${error.message}`);
      throw error;
  }
});
