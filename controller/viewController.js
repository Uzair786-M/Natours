const Tour = require('./../models/tourModel');
const APIErrors = require('./../Utils/apiErrors');

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

exports.getTour = async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: 'reviews',
      fields: 'review ratings user',
    })
    .populate({ path: 'guides' });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
};

exports.getLoginForm = async (req, res) => {
  res.status(200).render('login', {
    title: 'Login in to your account',
  });
};
