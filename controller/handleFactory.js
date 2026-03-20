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
  asyncCatch(async (req, res) => {
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
