const AppError = require("../lib/app_error.lib");
const {ERROR_500} = require("../lib/constants.lib");
const AWS = require('aws-sdk')

async function uploadFile(file) {

    // perform file upload
    try {
        const s3 = new AWS.S3({
            accessKeyId: process.env.S3_KEY,
            secretAccessKey: process.env.S3_SECRET
        })
        const params = {
            Bucket: 'all-things-great/test',
            ACL: 'public-read',
            Body: file.buffer,
            Key: `${Date.now()}-${file.originalname}`
        }
    
        s3.upload(params, (err, data) => {
            if(err) {
                throw err;
            }
        })
    } catch (err) {
        throw new AppError(`Failed to upload image to server: ${err.message}`, ERROR_500)
    }
    

}
  
module.exports = {
    uploadFile
}
  