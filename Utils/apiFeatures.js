class APIFeatures {
  constructor(query, queryString) {
    (this.query = query), (this.queryString = queryString);
  }

  filter() {
    // Advance filtering e.g {gte,gt,lte,le}
    // In native mongoDB we achieve this by another object inside object and by using special operator "$" like object.find({difficulty:"easy",duration :{$gte:5}})
    // query object comes from client side looks like { duration: { gt: '5' }, difficulty: 'easy' }
    // The challange is here how to get this "$" operator because it does not comes with query object.Solution to this problem is below here.
    let queryObj = { ...this.queryString };
    const excludedObj = ['page', 'limit', 'sort', 'fields'];
    excludedObj.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryStr);

    // // ignoring some querys

    this.query = this.query.find(queryObj);

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  fieldLimiting() {
    if (this.queryString.fields) {
      const projectionBy = this.queryString.fields.split(',').join(' ');

      this.query = this.query.select(projectionBy);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    let page = this.queryString.page * 1 || 1;
    let limit = this.queryString.limit * 1 || 100;

    let skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
