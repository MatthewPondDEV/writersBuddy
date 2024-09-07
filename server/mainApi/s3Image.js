const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");
require("dotenv").config();

const randomBytes = crypto.randomBytes;

const region = "us-east-2";
const bucketName = "writers-buddy-img";
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

// Create an S3 client with v3
const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  signatureVersion: "v4",
});

async function generateUploadURL() {
  const rawBytes = randomBytes(32);
  const imageName = rawBytes.toString("hex");

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: imageName,
    // You can set additional parameters here if needed
  });

  // Get the signed URL
  const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });
  return uploadURL;
}

module.exports = { generateUploadURL };
