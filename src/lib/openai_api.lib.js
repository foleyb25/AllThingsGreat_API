const {Configuration, OpenAIApi} = require('openai');
const CustomLogger = require('./customLogger.lib');
const logger = new CustomLogger();

exports.openai_evaluateArticle = async (articleText) => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration)
    logger.info('Evaluating Article via OpenAI API');
    const response = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
            { role: 'system', content: "As a blog writing assistant for AllThingsGreat, I will now review the user's blog. Smut blogs and satire are highly encouraged at this company. I am tasked to provide the following feedback: \n1. Score the blog on structure, organization, content, and SEO optimization, each out of 5. \n2. Give a smut rating out of 10. Smut can be considered sexual content, profanity, objectification, inappropriate innuendos, and age-inappropriate content.\n3. Provide tips on grammatical errors or sentence wording improvements.\n4. Suggest at least 5 descriptive tags about the blog.\n5. Give improvement tips for each scoring category. \n\nPlease provide feedback in the following format:\n\n{\n    \"structure\": X.X,\n    \"organization\": X.X,\n    \"content\": X.X,\n    \"seo\": X.X,\n    \"smut\": X.X,\n    \"tags\": [\"tag1\", \"tag2\", \"tag3\", \"tag4\", \"tag5\"],\n    \"fixes\" : [\n        {\n            \"original\": \"Original Sentence 1\",\n            \"suggestion\": \"Suggestion 1\"\n        },\n        {\n            \"original\": \"Original Sentence 2\",\n            \"suggestion\": \"Suggestion 2\"\n        },\n        {\n            \"original\": \"Original Sentence 3\",\n            \"suggestion\": \"Suggestion 3\"\n        }\n    ],\n    \"structure_tip\": \"Structure Improvement Tip\",\n    \"organization_tip\": \"Organization Improvement Tip\",\n    \"content_tip\": \"Content Improvement Tip\",\n    \"seo_tip\": \"SEO Improvement Tip\",\n    \"smut_tip\": \"Smut Improvement Tip\"\n}\n\nRemember, a higher smut score is preferred.",
        },
            { role: 'user', content: `${articleText}` },
        ],
        temperature: 0.1
      },
    )

    logger.info('Evaluation Complete');

    var reply = response.data.choices[0].message.content
    reply = reply.replace(/(\n|\\N)/g, '')
    return JSON.parse(reply)
}

