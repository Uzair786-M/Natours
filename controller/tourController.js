const Tour = require('./../models/tourModel');
const APIFeatures = require('./../Utils/apiFeatures');
const APIErrors = require('./../Utils/apiErrors');
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./handleFactory');

// const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

/// Route Handlers

const asyncCatch = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

exports.getAllTours = getAll(Tour);

exports.getTour = getOne(Tour, { path: 'reviews' });
exports.createTour = createOne(Tour);

exports.updateTour = updateOne(Tour);

// exports.deleteTour = asyncCatch(async (req, res) => {
//   await Tour.findByIdAndDelete(req.params.id);
//   res.status(204).json({
//     status: 'success',
//   });
// });

exports.deleteTour = deleteOne(Tour);

exports.tourStats = asyncCatch(async (req, res) => {
  // try {
  const stats = await Tour.aggregate([
    { $match: { price: { $gte: 100 } } },
    {
      $group: {
        _id: '$difficulty',
        totalNum: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: stats,
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: 'Data not found',
  //   });
  // }
});

exports.toursSoldPerMonth = asyncCatch(async (req, res) => {
  // try {
  const year = req.params.year * 1;
  const toursByMonth = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },

    {
      $match: {
        startDates: {
          $gte: `${new Date(`${year}-01-01`).toISOString()}`,
          $lte: `${new Date(`${year}-12-31`).toISOString()}`,
        },
      },
    },

    {
      $group: {
        _id: { $month: { $toDate: '$startDates' } },
        totalTourNum: { $sum: 1 },
        tourName: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { totalTourNum: -1 } },
    { $limit: 6 },
  ]);
  res.status(200).json({
    status: 'success',
    data: toursByMonth,
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: 'Data not found',
  //   });
  // }
});

exports.getToursWithIn = asyncCatch(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new APIErrors(
        'Please provide latitude and longitude in format of lat,lng',
        400,
      ),
    );
  }

  const toursInDistance = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    result: toursInDistance.length,
    tours: toursInDistance,
  });
});

exports.getDistances = asyncCatch(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    next(
      new APIErrors(
        'Please provide latitude and longitude in format of lat,lng',
        400,
      ),
    );
  }

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  const distance = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        name: 1,
        distance: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',

    data: distance,
  });
});
