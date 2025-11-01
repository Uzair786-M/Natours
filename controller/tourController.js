const Tour = require('./../models/tourModel');
// const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

/// Route Handlers

exports.getAllTours = async (req, res) => {
  const queryObj = { ...req.query };
  console.log(queryObj);
  const excludedObj = ['page', 'limit', 'sort', 'fields'];

  excludedObj.forEach((el) => delete queryObj[el]);
  console.log(queryObj);

  // Building Queries
  const query = Tour.find(queryObj);
  // const tours = await Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');

  //Executing Queries
  const tours = await query;

  // Responding to Queries
  res.status(200).json({
    status: 'success',
    result: tours.length,
    time: req.requestTime,
    data: {
      tours,
    },
  });
};

exports.getTour = async (req, res) => {
  const tour = await Tour.findOne({ _id: req.params.id });

  res.status(200).json({
    status: 'success',

    data: {
      tour,
    },
  });
};

exports.createTour = async (req, res) => {
  const tour = await new Tour(req.body);
  tour.save();
  res.status(201).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

exports.updateTour = async (req, res) => {
  await Tour.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    data: {
      updatedTour: await Tour.findById(req.params.id),
    },
  });
};

// exports.updateTourProperty = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: {
//       updatedProperty: '<Property is updating>',
//     },
//   });
// };

exports.deleteTour = async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
  });
};
