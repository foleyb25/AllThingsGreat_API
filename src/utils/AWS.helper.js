const AppError = require("../lib/app_error.lib");
const {ERROR_500} = require("../lib/constants.lib");
const AWS = require('aws-sdk')

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET
})


async function uploadFile(file) {
    return new Promise((resolve, reject) => {
        // perform file upload
        try {
            const params = {
                Bucket: 'allthingsgreat/test',
                ACL: 'public-read',
                Body: file.buffer,
                Key: `${Date.now()}-${file.originalname}`
            }
            s3.upload(params, (err, data) => {
                if(err) {
                    reject(err)
                }
                resolve("success")
            })
        } catch (err) {
            reject(err)
        }
    })
}

async function getImageUrls(id) {

    return new Promise((resolve, reject) => {    
        try {
            const params = {
                Bucket: 'allthingsgreat',
                Prefix: 'test',
                MaxKeys: 10
            }
            s3.listObjects(params, async (err, data) => {
                if(err) {
                    console.log(err)
                    throw new AppError(`Failed to upload image to server: ${err.message}`, ERROR_500)
                }
    
                const imageObjects = data.Contents.filter(object => 
                    object.Key.endsWith('.jpg') || 
                    object.Key.endsWith('.png') ||
                    object.Key.endsWith('.PNG') ||
                    object.Key.endsWith('.JPG') ||
                    object.Key.endsWith('.jpeg') ||
                    object.Key.endsWith('.JPEG') ||
                    object.Key.endsWith('.gif') ||
                    object.Key.endsWith('.GIF')
                    );
    
                var image_urls = []
    
                await imageObjects.forEach(imageObject => {
                    try {
                        s3.getSignedUrl('getObject', {
                            Bucket: "allthingsgreat",
                            Key: imageObject.Key,
                            Expires: 60
                        }, (err,url) => {
                            if(err) {
                                reject(err)
                            }
                            var formattedUrl = new URL(url)
                            var searchParams = new URLSearchParams(formattedUrl.search)
                            searchParams.delete("AWSAccessKeyId")
                            searchParams.delete('Signature');
                            searchParams.delete('Expires');
                            formattedUrl.search = searchParams.toString();
                            var finalizedUrl = formattedUrl.toString()
                            image_urls.push(finalizedUrl)
                        });
                        
                    } catch (err) {
                        reject(err)
                    }
                    
                    
                })
                
                resolve(image_urls)
                
            })
        } catch (err) {
            reject(err)
        }

    })

    
}
  
module.exports = {
    uploadFile,
    getImageUrls
}
  