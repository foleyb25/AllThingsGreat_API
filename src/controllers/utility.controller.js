const puppeteer = require("puppeteer");
const { createLogger } = require("../lib/logger.lib");
const logger = createLogger();

async function downloadPDF(req, res) {
  try {
    const { html, css } = req.body;

    logger.info("Initializing PDF download...");

    // Use puppeteer to create the PDF
    const browser = await puppeteer.launch({
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH || "google-chrome-stable",
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    const fullHtml = `
          <html>
              <head>
                  <style>${css}</style>
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

module.exports = {
  downloadPDF,
};
