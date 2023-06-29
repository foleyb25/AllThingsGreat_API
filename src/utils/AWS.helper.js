const AWS = require("aws-sdk");
const AppError = require("../lib/app_error.lib");
const { ERROR_500 } = require("../lib/constants.lib");

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
});

async function uploadFile(file, bucket) {
  return new Promise((resolve, reject) => {
    // perform file upload
    try {
      const params = {
        Bucket: bucket,
        ACL: "public-read",
        Body: file.buffer,
        Key: `${Date.now()}-${file.originalname}.jpeg`,
      };
      // S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
      // Please convert to `await client.upload(params, options).promise()`, and re-run aws-sdk-js-codemod.
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve({ status: "success", data });
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function getImageUrls(bucket, prefix) {
  return new Promise((resolve, reject) => {
    try {
      const params = {
        Bucket: bucket,
        Prefix: prefix,
        MaxKeys: 10,
      };
      s3.listObjects(params, async (err, data) => {
        if (err) {
          throw new AppError(
            `Failed to upload image to server: ${err.message}`,
            ERROR_500
          );
        }

        const imageObjects = data.Contents.filter(
          (object) =>
            object.Key.endsWith(".jpg") ||
            object.Key.endsWith(".png") ||
            object.Key.endsWith(".PNG") ||
            object.Key.endsWith(".JPG") ||
            object.Key.endsWith(".jpeg") ||
            object.Key.endsWith(".JPEG") ||
            object.Key.endsWith(".gif") ||
            object.Key.endsWith(".GIF")
        );

        const imageUrls = [];

        for (const imageObject of imageObjects) {
          try {
            s3.getSignedUrl(
              "getObject",
              {
                Bucket: bucket,
                Key: imageObject.Key,
                Expires: 60,
              },
              (err, url) => {
                if (err) {
                  reject(err);
                }
                const formattedUrl = new URL(url);
                const searchParams = new URLSearchParams(formattedUrl.search);
                searchParams.delete("AWSAccessKeyId");
                searchParams.delete("Signature");
                searchParams.delete("Expires");
                formattedUrl.search = searchParams.toString();
                const finalizedUrl = formattedUrl.toString();
                imageUrls.push(finalizedUrl);
              }
            );
          } catch (err) {
            reject(err);
          }
        }

        resolve(imageUrls);
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  uploadFile,
  getImageUrls,
};
