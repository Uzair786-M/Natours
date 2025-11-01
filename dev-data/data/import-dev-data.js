const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const db = process.env.REMOTE_DATABASE.replace(
  '<PASSWORD>',
  process.env.PASSWORD
);

mongoose
  .connect(db)
  .then(() => console.log('connection with database is sucessful'))
  .catch((err) => console.log('Oh Error', err));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importTours = async () => {
  try {
    await Tour.create(tours);
    console.log('Data is uploaded successfully');
    process.exit();
  } catch (err) {
    console.log('There is error in creating tours', err);
  }
};

const deleteTours = async () => {
  try {
    await Tour.deleteMany();

    console.log('Data is deleted successfully');
    process.exit();
  } catch (err) {
    console.log('There is error in deleting tours', err);
  }
};

if (process.argv[2] === '--import') {
  importTours();
} else if (process.argv[2] === '--delete') {
  deleteTours();
}
