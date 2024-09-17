const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env.local' });

const app = require('../app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    //.connect(process.env.DATABASE_LOCAL, {
  })
  .then(() => {
    console.log('DB connection successful!');
  });

const port = process.env.PORT || 3002;

app.use(require('../controllers/errorControllers'));

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

module.exports = app;
