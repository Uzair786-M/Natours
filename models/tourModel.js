const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Tour must contain a name'],
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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
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
  console.log(this.pipeline());
});

module.exports = Tour = mongoose.model('Tour', tourSchema);
