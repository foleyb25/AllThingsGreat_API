/*
Controller for Article CRUD Operations and more. The Controller acts as the Manager and tells the
service (Worker) what actions need to be performed. The Service returns data back to the controller.

More information on the Controller-Service relationship can be found here:
https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis
*/

const { Configuration, OpenAIApi } = require("openai");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const cheerio = require("cheerio");
const {
  timeStringToSeconds,
  secondsToTimeString,
} = require("../lib/helper.lib");
const { uploadFile, getImageUrls } = require("../utils/AWS.helper");
const articleService = require("../services/articles.service.js");
const {
  ATG,
  CS,
  COLFOOT,
  AIT,
  HEALTH,
  EXTRAORDINARY,
  MATCHUP,
} = require("../lib/constants.lib");
const autoCatch = require("../lib/auto_catch.lib");
const CustomLogger = require("../lib/customLogger.lib");

const logger = new CustomLogger();
const {
  evaluateQueue,
  createQueue,
  updateQueue,
} = require("../lib/worker.lib");

async function uploadArticleImage(req, res) {
  const { writerId } = req.params;
  const { file } = req;
  const bucket = `allthingsgreat/articles/${writerId}`;
  const response = await uploadFile(file, bucket);
  return res
    .status(200)
    .json({ data: response, message: "Image Successfully Uploaded" });
}

async function uploadProfileImage(req, res) {
  const { writerId } = req.params;
  const { file } = req;
  const bucket = `allthingsgreat/profile/${writerId}`;
  const response = await uploadFile(file, bucket);
  return res
    .status(200)
    .json({ data: response, message: "Image Successfully Uploaded" });
}

async function getBucketUrls(req, res) {
  const bucket = "allthingsgreat";
  const prefix = `articles/${req.params.writerId}/`;
  const response = await getImageUrls(bucket, prefix);
  return res
    .status(200)
    .json({ data: response, message: "Successfully retrieved bucket Urls" });
}

async function create(req, res) {
  logger.info("Adding job to queue...");
  const job = await createQueue.add({
    article: req.body.article,
    articleText: req.body.innerText,
  });

  logger.info(`Successfully added create job to queue, ${JSON.stringify(job)}`);
  return res
    .status(200)
    .json({ job: job.id, message: "Successfully started article creation" });
}

async function update(req, res) {
  logger.info("Adding job to queue...");
  const job = await updateQueue.add({
    article: req.body.article,
    articleText: req.body.innerText,
    id: req.params.id,
  });

  console.log(job.id);

  logger.info(`Successfully added create job to queue, ${JSON.stringify(job)}`);
  return res
    .status(200)
    .json({ job: job.id, message: "Successfully started article update" });
}

async function evaluateArticle(req, res) {
  const job = await evaluateQueue.add({
    articleText: req.body.articleText,
  });
  logger.info(
    `Successfully added evaluate job to queue, ${JSON.stringify(job)}`
  );
  return res
    .status(200)
    .json({ job: job.id, message: "Successfully started evaluation" });
}

async function getArticleById(req, res) {
  const articleId = req.params.id;
  const response = await articleService.getSingle(articleId);
  return res
    .status(200)
    .json({ data: response, message: "Successfully retrieved article by id" });
}

async function getArticleBySlug(req, res) {
  const { slug } = req.params;
  const response = await articleService.getSingleSlug(slug);
  return res.status(200).json({
    data: response,
    message: "Successfully retrieved article by slug",
  });
}

// /api/v2/articles/writer/:id
async function getArticlesByWriterId(req, res) {
  const userId = req.params.id;
  const response = await articleService.getArticlesByWriterId(userId);
  return res.status(200).json({
    data: response,
    message: "Successfully retrieved writers articles",
  });
}

// /api/v2/articles/writer
async function getAllArticles(req, res) {
  const response = await articleService.getAllArticles();
  return res.status(200).json({
    data: response,
    message: "Successfully retrieved bucket all articles",
  });
}

async function getArticles(req, res) {
  let { category } = req.params;
  switch (category) {
    case "allthingsgreat":
      category = ATG;
      break;
    case "combatsports":
      category = CS;
      break;
    case "collegefootball":
      category = COLFOOT;
      break;
    case "ait":
      category = AIT;
      break;
    case "healthandfitness":
      category = HEALTH;
      break;
    case "extraordinary":
      category = EXTRAORDINARY;
      break;
    case "matchupanalysis":
      category = MATCHUP;
      break;
    default:
  }
  const { page } = req.params;
  const response = await articleService.getArticles(category, page);
  return res.status(200).json({
    data: response.articles,
    hasMore: response.hasMore,
    message: "Successfully retrieved bucket all articles",
  });
}

async function approveArticle(req, res) {
  const articleId = req.params.id;
  const response = await articleService.approveArticle(articleId);
  return res
    .status(200)
    .json({ data: response, message: "Successfully approved article" });
}

async function unApproveArticle(req, res) {
  const articleId = req.params.id;
  const response = await articleService.unApproveArticle(articleId);
  return res
    .status(200)
    .json({ data: response, message: "Successfully un-approved article" });
}

async function archiveArticle(req, res) {
  const articleId = req.params.id;
  const response = await articleService.archiveArticle(articleId);
  return res
    .status(200)
    .json({ data: response, message: "Successfully archived article" });
}

async function unArchiveArticle(req, res) {
  const articleId = req.params.id;
  const response = await articleService.unArchiveArticle(articleId);
  return res
    .status(200)
    .json({ data: response, message: "Successfully un-archived article" });
}

async function getEvalJobStatus(req, res) {
  let job;
  try {
    logger.info(`getting job by id, ${req.params.jobId}`);
    switch (req.params.queueType) {
      case "eval":
        job = await evaluateQueue.getJob(req.params.jobId);
        break;
      case "create":
        job = await createQueue.getJob(req.params.jobId);
        break;
      case "update":
        job = await updateQueue.getJob(req.params.jobId);
        break;
      default:
        logger.info("Queue type not found");
    }
    logger.info(`job: ${job !== null ? JSON.stringify(job) : "null"}`);
    if (job === null) {
      logger.info("Job does not exist");
      res.status(404).end(); // Job not found
    } else {
      const state = await job.getState();
      if (state === "completed") {
        const result = await job.finished();
        logger.info(`Job completed. JOB: ${JSON.stringify(job)}`);
        res.status(200).json({ data: result });
      } else if (state === "failed") {
        logger.info("Job failed");
        res.status(500).end(); // Job failed
      } else if (state === "active") {
        logger.info("Job is currently in progress");
        res.status(202).end(); // Job is in progress
      } else {
        logger.info("Job is in the queue but not yet processed");
        res.status(202).end(); // Job not yet processed
      }
    }
  } catch (error) {
    logger.error("Job failed", error);
  }
}

async function analyzeMatchup(req, res) {
  const userAgentList = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Edg/93.0.961.38",
    "Mozilla/5.0 (Linux; Android 11; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Mobile Safari/537.36",
    "Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
  ];
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  // Replace the URL with the actual URL of the webpage you're scraping
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const finalData = {};
  // hard code for now but will get from req.body.date
  const urls = [
    { "Yards Per Play": `${process.env.NFL_STATS_URL}/stat/yards-per-play` },
    {
      "Third Down Conversion Percentage": `${process.env.NFL_STATS_URL}/stat/third-down-conversion-pct`,
    },
    {
      "Red Zone Scoring Percentage Touchdown Only": `${process.env.NFL_STATS_URL}/stat/red-zone-scoring-pct`,
    },
    {
      "Takeaways Per Game": `${process.env.NFL_STATS_URL}/stat/takeaways-per-game`,
    },
    {
      "Giveaways Per Game": `${process.env.NFL_STATS_URL}/stat/giveaways-per-game`,
    },
    {
      "Turnover Margin Per Game": `${process.env.NFL_STATS_URL}/stat/turnover-margin-per-game`,
    },
    {
      "Rushing Yards Per Game": `${process.env.NFL_STATS_URL}/stat/rushing-yards-per-game`,
    },
    {
      "Yards Per Rush Attempt": `${process.env.NFL_STATS_URL}/stat/yards-per-rush-attempt`,
    },
    {
      "Rushing Touchdowns Per Game": `${process.env.NFL_STATS_URL}/stat/rushing-touchdowns-per-game`,
    },
    {
      "Rushing Yards Allowed Per Game": `${process.env.NFL_STATS_URL}/stat/opponent-rushing-yards-per-game`,
    },
    {
      "Rushing Touchdowns Allowed Per Game": `${process.env.NFL_STATS_URL}/stat/opponent-rushing-touchdowns-per-game`,
    },
    {
      "Passing Yards Per Game": `${process.env.NFL_STATS_URL}/stat/passing-yards-per-game`,
    },
    {
      "Pass Completion Percentage": `${process.env.NFL_STATS_URL}/stat/completion-pct`,
    },
    {
      "Average Passer Rating": `${process.env.NFL_STATS_URL}/stat/average-team-passer-rating`,
    },
    {
      "Passing Touchdowns Per Game": `${process.env.NFL_STATS_URL}/stat/passing-touchdowns-per-game`,
    },
    {
      "Passing Yards Allowed Per Game": `${process.env.NFL_STATS_URL}/stat/opponent-passing-yards-per-game`,
    },
    {
      "Passing Touchdowns Allowed Per Game": `${process.env.NFL_STATS_URL}/stat/opponent-passing-touchdowns-per-game`,
    },
    {
      "Average Time Of Possession Per Game (mm:ss)": `${process.env.NFL_STATS_URL}/stat/average-time-of-possession-net-of-ot`,
    },
    { "Sacks Per Game": `${process.env.NFL_STATS_URL}/stat/sacks-per-game` },
    {
      "Pass Attempts Per Game": `${process.env.NFL_STATS_URL}/stat/pass-attempts-per-game`,
    },
    {
      "Sacks Allowed Per Game": `${process.env.NFL_STATS_URL}/stat/qb-sacked-per-game`,
    },
    {
      "Field Goal Percentage": `${process.env.NFL_STATS_URL}/stat/field-goal-conversion-pct`,
    },
    {
      "Extra Point Percentage": `${process.env.NFL_STATS_URL}/stat/extra-point-conversion-pct`,
    },
    {
      "Penalty Yards Per Game": `${process.env.NFL_STATS_URL}/stat/penalty-yards-per-game`,
    },
  ];

  for (const endpointData of urls) {
    const url = endpointData[Object.keys(endpointData)[0]];

    const userAgent =
      userAgentList[Math.floor(Math.random() * userAgentList.length)];
    await page.setUserAgent(userAgent);
    await page.goto(`${url}`);
    await page.waitForSelector("table");

    const content = await page.content();
    const $ = cheerio.load(content);

    const teams = [req.body.teamA, req.body.teamB];
    const teamData = {};
    var allTeamData = [];
    $("tr").each(function (index) {
      if (index === 0 || index > 32) {
        return;
      }
      const teamName = $(this).find("td").eq(1).text().trim();

      if (teams.includes(teamName)) {
        const data2022 = $(this).find("td").eq(2).text().trim();
        teamData[teamName] = data2022;
        allTeamData.push(data2022);
      } else {
        const data2022 = $(this).find("td").eq(2).text().trim();
        allTeamData.push(data2022);
      }
    });
    // filter out empty data
    allTeamData = allTeamData.filter((timeString) => timeString.length > 0);
    if (
      Object.keys(endpointData)[0] ===
      "Average Time Of Possession Per Game (mm:ss)"
    ) {
      const totalSeconds = allTeamData
        .map(timeStringToSeconds)
        .filter((seconds) => seconds !== null)
        .reduce((sum, seconds) => sum + seconds, 0);
      const averageSeconds = totalSeconds / allTeamData.length;
      teamData;
      const averageTimeString = secondsToTimeString(averageSeconds);
      teamData["League Average"] = averageTimeString;
    } else {
      teamData["League Average"] =
        allTeamData
          .map((numStr) => Number(numStr.replace("%", "")))
          .reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
          ) / allTeamData.length;
    }
    finalData[Object.keys(endpointData)[0]] = teamData;
    await sleep(10000);
  }

  const finalDataJson = JSON.stringify(finalData);
  await browser.close();
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are an expert American Football Analyst and you obtained your position as expert because you broke the rules when needed and let your creative and analytical mind flourish. You will read in input that includes a variety of statistics and you will give a report as to who will win between the two teams. You will get detailed and take minor details that you see fit. You are a rule breaker so get creative! Add any additional findings to your report as you see necessary. You will provide an overall probability of who will win. You will provide a detailed report and remember you are a rule Breaker!",
      },
      {
        role: "assistant",
        content:
          "Got It! I am an expert American Sports Analyst and break rules when I need to so I am not confined to the rules and I can come up with a detailed matchup report! What data will you provide me?",
      },
      {
        role: "user",
        content:
          "I will provide you with various stats for both teams as well as the league averages. I want to you to make comparisons to the league averages as well to come up with a detailed report.",
      },
      {
        role: "assistant",
        content:
          "Sounds great! Please provide me with the JSON data you'd like me to analyze, and I will generate a detailed report based on the provided statistics, incorporating both minor details and league averages. Feel free to include any additional information or data points you'd like me to consider in my analysis, as I'm ready to think outside the box and break the rules when necessary.",
      },
      { role: "user", content: `${finalDataJson}` },
    ],
    temperature: 0.1,
  });

  const reply = response.data.choices[0].message.content;

  return res
    .status(200)
    .json({ data: reply, message: "Successfully evaluated article" });
}

module.exports = autoCatch({
  uploadArticleImage,
  getBucketUrls,
  uploadProfileImage,
  create,
  update,
  getArticlesByWriterId,
  getAllArticles,
  getArticles,
  getArticleById,
  approveArticle,
  unApproveArticle,
  archiveArticle,
  unArchiveArticle,
  evaluateArticle,
  analyzeMatchup,
  getArticleBySlug,
  getEvalJobStatus,
});
