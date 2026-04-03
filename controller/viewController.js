const Tour = require('./../models/tourModel');

exports.getOverview = async (req, res) => {
  //1) Get all tours from database
  const tours = await Tour.find();
  //2) Build template for overview page

  //3) Render tempelates to browser

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
};

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
    tour: 'This is page of tour',
  });
};
