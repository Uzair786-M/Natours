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
      return next(new APIErrors('No user found with this ID', 404));
    }
    res.status(204).json({
      status: 'success',
    });
  });
