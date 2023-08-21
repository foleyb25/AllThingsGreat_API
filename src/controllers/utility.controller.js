const puppeteer = require("puppeteer");

async function downloadPDF(req, res) {
  try {
    const { html, css } = req.body;

    // Use puppeteer to create the PDF
    const browser = await puppeteer.launch();
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

    await page.setContent(fullHtml);

    // Take a screenshot of the specific element.
    await page.waitForSelector("#selfPortrait");
    const element = await page.$("#selfPortrait"); // Replace with your selector.
    const elementScreenshot = await element.screenshot({ encoding: "base64" });

    // Construct the data URI for the screenshot.
    const imageDataURI = `data:image/png;base64,${elementScreenshot}`;

    // Replace the 'src' of the image element with the screenshot data URI.
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
    res.status(500).send("Failed to generate PDF.");
  }
}

module.exports = {
  downloadPDF,
};
