const multer = require('multer');
const path = require('path');
const slugify = require('slugify');

const storage = multer.diskStorage({
  destination: './public/userProfileImages',
  filename: function(req, file, cb) {
    const fileName = file.originalname;
    const slug = slugify(fileName.split('.')[0], { lower: true });
    const extension = path.extname(fileName).slice(1);
    const newFileName = `${Date.now()}-${slug}.${extension}`;
    cb(null, newFileName);
  }
});

const upload = multer({ storage });

module.exports = upload;
