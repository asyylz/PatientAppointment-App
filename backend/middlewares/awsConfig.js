const AWS = require('aws-sdk');
const multer = require('multer');
const dotenv = require('dotenv');
const slugify = require('slugify');
const AppError = require('./../utils/appError');

dotenv.config();
// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Middleware function to upload file to S3
const uploadToS3 = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  console.log('file', req.file);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}-${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
    // ACL: 'public-read' // Uncomment if you want the file to be publicly readable
  };
  console.log('params', params);
  try {
    const data = await s3.upload(params).promise();
    console.log('data', data);
    req.fileLocation = data.Location;
    console.log(req.fileLocation);
    next();
  } catch (err) {
    next(new AppError('Failed to upload file.', 500));
  }
};

module.exports = {
  upload,
  uploadToS3
};
