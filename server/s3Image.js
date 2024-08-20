import aws from 'aws-sdk'
import crypto from 'crypto'
import { promisify } from 'util'
require("dotenv").config();

const randomBytes = promisify(crypto.randomBytes)

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

export async function generateUploadURL() {
    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return up
}