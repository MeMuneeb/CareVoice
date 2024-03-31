const mongoose = require('mongoose');
const catchAsync = require('./../utils/catchAsync');
const Visit = require('./../models/visitModel');
const AppError = require('../utils/appError');

exports.getVisits = catchAsync(async (req, res, next) => {
  const visits = await Visit.aggregate([
    { $match: { patientId: new mongoose.Types.ObjectId(req.user._id) } },
    {
      $lookup: {
        from: 'users', // the collection name in MongoDB
        localField: 'doctorId',
        foreignField: '_id',
        as: 'doctorDetails',
      },
    },
    { $unwind: '$doctorDetails' },
    {
      $project: {
        visitDate: 1,
        surveyId: 1,
        doctorName: '$doctorDetails.name',
      },
    },
  ]);
  if (visits.length === 0 || !visits) {
    return next(new AppError('No available visits', 404));
  }
  res.status(200).json({
    status: 'success',
    results: visits.length,
    visits,
  });
});

exports.createVisit = catchAsync(async (req, res, next) => {
  const visit = await Visit.create(req.body);
  res.status(201).json({
    status: 'success',
    visit,
  });
});
