const multer = require("multer")
// const multerS3 = require('multer-s3');
// const aws = require("aws-sdk")
// const auto_catch = require("../lib/auto_catch.lib")

// aws.config.update({
//     secretAccessKey: process.env.S3_SECRET,
//     accessKeyId: process.env.S3_KEY,
//     region: 'us-west-2'
// });

//     s3 = new aws.S3();

// exports.upload = multer({
//     storage: multerS3({
//         s3: s3,
//         acl: 'public-read',
//         bucket: 'all-things-great/test',
//         key: function (req, file, cb) {
//             console.log(file);
//             cb(null, file.originalname); //use Date.now() for unique file keys
//         }

//     })
// })

const storage = multer.memoryStorage()  
exports.upload = multer({ storage: storage });