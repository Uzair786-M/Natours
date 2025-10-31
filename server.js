const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');

// Remote database connection using moongoose

const db = process.env.REMOTE_DATABASE.replace(
  '<PASSWORD>',
  process.env.PASSWORD
);
mongoose
  .connect(db)
  .then(() => {
    console.log(`connection is successful`);
  })
  .catch((err) => console.log('Connection Failed', err));

const port = process.env.PORT || 8000;
console.log(process.env.PORT);
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
