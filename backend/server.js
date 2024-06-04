const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env.local' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
console.log('asiye', process.env.DATABASE);

mongoose
  .connect(DB, {
    //.connect(process.env.DATABASE_LOCAL, {
  })
  .then(() => {
    console.log('DB connection successful!');
  });


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
