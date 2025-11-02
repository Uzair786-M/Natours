const Tour = require('./../models/tourModel');
// const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

/// Route Handlers

exports.getAllTours = async (req, res) => {
  // Advance filtering e.g {gte,gt,lte,le}
  // In native mongoDB we achieve this by another object inside object and by using special operator "$" like object.find({difficulty:"easy",duration :{$gte:5}})
  // query object comes from client side looks like { duration: { gt: '5' }, difficulty: 'easy' }
  // The challange is here how to get this "$" operator because it does not comes with query object.Solution to this problem is below here.

  let queryObj = { ...req.query };
  let queryStr = JSON.stringify(queryObj);

  queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
  queryObj = JSON.parse(queryStr);
  // console.log(queryObj);

  // ignoring some querys
  const excludedObj = ['page', 'limit', 'sort', 'fields'];

  excludedObj.forEach((el) => delete queryObj[el]);
  // console.log(queryObj);

  // Building Queries

  // console.log(sortedQuery);
  console.log(queryObj);
  let query = Tour.find(queryObj);
  // const tours = await Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Field limit OR Projection

  if (req.query.fields) {
    const projectionBy = req.query.fields.split(',').join(' ');

    query = query.select(projectionBy);
  } else {
    query = query.select('-__v');
  }

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
