const puppeteer = require("puppeteer");
const { createLogger } = require("../lib/logger.lib");
const logger = createLogger();
const { sendFirstServiceEmail } = require("../lib/notifications.lib");
const autoCatch = require("../lib/auto_catch.lib");

async function downloadPDF(req, res) {
  try {
    const { html, css } = req.body;

    logger.info("Initializing PDF download...");

    // Use puppeteer to create the PDF
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    const fullHtml = `
          <html>
              <head>
                  <style>${css}
                  html, body {
                    height: 1123px;
                    background-color: rgb(229 231 235); 
                    margin: 0;
                    padding: 0;
                }
                </style>
              </head>
              <body>
              ${html}
          </body>
          </html>
        `;

    logger.info("Setting page content...");
    await page.setContent(fullHtml);

    // Take a screenshot of the specific element.
    await page.waitForSelector("#selfPortrait");
    const element = await page.$("#selfPortrait"); // Replace with your selector.
    const elementScreenshot = await element.screenshot({ encoding: "base64" });

    // Construct the data URI for the screenshot.
    const imageDataURI = `data:image/png;base64,${elementScreenshot}`;

    // Replace the 'src' of the image element with the screenshot data URI.
    logger.info("Initializing PDF download...");
    await page.evaluate((dataURI) => {
      const downloadButton = document.querySelector("#downloadButton");
      if (downloadButton) {
        downloadButton.remove();
      }
      const img = document.querySelector("#selfPortrait"); // Adjust the selector if necessary.
      img.src = dataURI;
    }, imageDataURI);

    const pdf = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Failed to generate PDF: ${error}`);
  }
}

const sendEmail = async (req, res) => {
  const data = req.body;

  const info = await sendFirstServiceEmail(data);
  res.status(200).send(`Successfully sent email. INFO: ${info}`);
};

module.exports = autoCatch({
  downloadPDF,
  sendEmail,
});
