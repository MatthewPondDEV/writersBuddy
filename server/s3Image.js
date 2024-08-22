const aws = require('aws-sdk')
const crypto = require('crypto')
require("dotenv").config();

const randomBytes = crypto.randomBytes

const region = 'us-east-2'
const bucketName = 'writers-buddy-img'
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new aws.S3({ 
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})
async function generateUploadURL() {
    const rawBytes = randomBytes(32)
    const imageName = rawBytes.toString('hex')

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL
}

module.exports = {generateUploadURL}