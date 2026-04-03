exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All tours',
    overView: 'This is overview page',
  });
};

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
    tour: 'This is page of tour',
  });
};
