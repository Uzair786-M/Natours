const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Tour must contain a name'],
      trim: true,
      minlength: [10, 'Tour name must have minimum 10 charaters'],
      maxlength: [
        40,
        'Tour name must have below than or equal to 40 characters',
      ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Tour must contain duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must contain group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must contain difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: `Tour should only be easy,medium and difficult,{VALUE} is not allowed`,
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Tour rating must be more or equal to 1'],
      max: [5, 'Tour rating must be less or equal to 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      required: [true, 'Tour must contain a Summary'],
    },
    description: {
      type: String,
      required: [true, 'Tour must contain description'],
    },
    price: {
      type: Number,
      required: [true, 'Tour must contain a Price'],
    },
    imageCover: String,
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [String],
    secerateData: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

// Document Middleware

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  // console.log(this);
  next();
});

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
// });

// Query Middleware

tourSchema.pre('find', function (next) {
  this.find({ secerateData: { $ne: true } });
  next();
});

// Aggregation Middleware

tourSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { difficulty: 'easy' } });
  // console.log(this.pipeline());
});

module.exports = Tour = mongoose.model('Tour', tourSchema);
