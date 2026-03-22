const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');
const ReviewModel = require('./../../models/reviewModel');
const db = process.env.REMOTE_DATABASE.replace(
  '<PASSWORD>',
  process.env.PASSWORD,
);

mongoose
  .connect(db, { dbName: 'Natours' })
  .then(() => console.log('connection with database is sucessful'))
  .catch((err) => console.log('Oh Error', err));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

const importTours = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);

    console.log('Data is uploaded successfully');
    process.exit();
  } catch (err) {
    console.log('There is error in creating tours', err);
  }
};

const deleteTours = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await ReviewModel.deleteMany();

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
