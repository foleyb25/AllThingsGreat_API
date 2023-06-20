// jobQueue.js
const Queue = require('bull');
const evaluateQueue = new Queue('evaluateArticle', process.env.REDIS_URL);

evaluateQueue.on('global:completed', (jobId, result) => {
  console.log(`Job completed with result ${result} for job ID ${jobId}`);
});

module.exports = { evaluateQueue };