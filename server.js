const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

const mongoose = require('mongoose');
const app = require('./app');

// Remote database connection using moongoose

const db = process.env.REMOTE_DATABASE.replace(
  '<PASSWORD>',
  process.env.PASSWORD
);
mongoose.connect(db).then(() => {
  console.log(`connection is successful`);
});
// .catch((err) => console.log('Connection Failed', err));

const port = process.env.PORT || 8000;
console.log(process.env.PORT);
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
