const AWS = require('aws-sdk');
const multer = require('multer');
const dotenv = require('dotenv');
const slugify = require('slugify');

dotenv.config();

// Configure AWS with your access and secret key.
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Create an S3 instance
const s3 = new AWS.S3();
//const myBucket = process.env.AWS_S3_BUCKET_NAME;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToS3 = (req, res, next) => {
  console.log('fromaws config', req.file);
  console.log('AWS Region:', process.env.AWS_REGION);
  console.log('Bucket Name:', process.env.AWS_S3_BUCKET_NAME);

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  //const fileName = file.originalname;
  //   const slug = slugify(fileName.split('.')[0], { lower: true });

  const { email } = req.body;
  const parts = email.split('@');
  const emailForFileName = `${parts[0]}%40${parts[1]}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}-${email}-${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
    // ACL: 'public-read'
  };

  s3.upload(params, (err, data) => {
    if (err) {
      //console.error('Error uploading file to S3:', err);
      return res.status(500).send('Failed to upload file.');
    }
    //console.log('data', data.Location);
    req.fileLocation = data.Location;
    //console.log('file location', req.fileLocation);
    next();
  });
};

module.exports = {
  upload,
  uploadToS3
};
