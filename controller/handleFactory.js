const APIFeatures = require('./../Utils/apiFeatures');
const APIErrors = require('./../Utils/apiErrors');

const asyncCatch = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

exports.deleteOne = (Model) =>
  asyncCatch(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new APIErrors('No document found with this ID', 404));
    }
    res.status(204).json({
      status: 'success',
    });
  });

exports.updateOne = (Model) =>
  asyncCatch(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    });

    if (!doc) {
      return next(new APIErrors('No document found with this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        updatedDocument: await Model.findById(req.params.id),
      },
    });
  });

exports.createOne = (Model) =>
  asyncCatch(async (req, res, next) => {
    const doc = await Model.create(req.body);

    if (!doc) {
      return next(new APIErrors('No document found with this ID', 404));
    }

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  asyncCatch(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    let features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sorting()
      .fieldLimiting()
      .paginate();

    //Executing Queries
    const doc = await features.query;

    if (!doc) {
      return next(new APIErrors('No document found', 404));
    }

    // Responding to Queries
    res.status(200).json({
      status: 'success',
      result: doc.length,
      time: req.requestTime,
      data: {
        doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  asyncCatch(async (req, res, next) => {
    // const query = await Model.findOne({ _id: req.params.id });
    let query = await Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new APIErrors('No document found', 404));
    }

    res.status(200).json({
      status: 'success',

      data: {
        doc,
      },
    });
  });
