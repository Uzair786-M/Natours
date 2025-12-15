const Tour = require('./../models/tourModel');
const APIFeatures = require('./../Utils/apiFeatures');
const APIErrors = require('./../Utils/apiErrors');
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

exports.getAllTours = asyncCatch(async (req, res) => {
  let features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sorting()
    .fieldLimiting()
    .paginate();

  //Executing Queries
  const tours = await features.query;

  // Responding to Queries
  res.status(200).json({
    status: 'success',
    result: tours.length,
    time: req.requestTime,
    data: {
      tours,
    },
  });
});

exports.getTour = asyncCatch(async (req, res) => {
  const tour = await Tour.findOne({ _id: req.params.id });

  res.status(200).json({
    status: 'success',

    data: {
      tour,
    },
  });
});

exports.createTour = asyncCatch(async (req, res, next) => {
  const tour = new Tour(req.body);
  const result = await tour.save();
  res.status(201).json({
    status: 'success',
    data: {
      tour: result,
    },
  });
});

exports.updateTour = asyncCatch(async (req, res) => {
  await Tour.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      updatedTour: await Tour.findById(req.params.id),
    },
  });
});

// exports.updateTourProperty = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: {
//       updatedProperty: '<Property is updating>',
//     },
//   });
// };

exports.deleteTour = asyncCatch(async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
  });
});

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
