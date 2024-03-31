const catchAsync = require('./../utils/catchAsync');
const Survey = require('./../models/surveyModel');
const Visit = require('./../models/visitModel');
const AppError = require('../utils/appError');

exports.createSurvey = catchAsync(async (req, res, next) => {
  let oldSurvey = await Survey.findOne({
    doctorId: req.body.doctorId,
    active: true,
  });
  if (oldSurvey) {
    oldSurvey = await Survey.findByIdAndUpdate(
      oldSurvey._id,
      { active: false },
      { runValidators: true }
    );
  }
  const survey = await Survey.create(req.body);
  res.status(201).json({
    status: 'success',
    survey,
  });
});

exports.getSurveyForDoctor = catchAsync(async (req, res, next) => {
  const survey = await Survey.find({
    doctorId: req.user.id,
    active: true,
  });
  if (!survey) {
    return next(new AppError('No survey found for doctor', 404));
  }
  res.status(200).json({
    status: 'success',
    survey,
  });
});

exports.modifySurvey = catchAsync(async (req, res, next) => {
  const oldSurvey = await Survey.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { runValidators: true }
  );
  if (!oldSurvey) {
    return next(new AppError('No survey found with that ID', 404));
  }
  const survey = await Survey.create(req.body);
  res.status(201).json({
    status: 'success',
    survey,
  });
});

exports.getSurvey = catchAsync(async (req, res, next) => {
  const survey = await Survey.findById(req.params.id);
  if (!survey) {
    return next(new AppError('No survey found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    survey,
  });
});

exports.getSurveyForFeedback = catchAsync(async (req, res, next) => {
  const visit = await Visit.findById(req.params.visitId);
  if (!visit) {
    return next(new AppError('No visit found with that ID', 404));
  }
  const survey = await Survey.findOne({
    doctorId: visit.doctorId,
    active: true,
  });
  // Check if surveys are found
  if (!survey || survey.length === 0) {
    return next(
      new AppError('No active survey found for the associated doctor', 404)
    );
  }
  visit.surveyId = survey._id;
  await visit.save();

  res.status(200).json({
    status: 'success',
    survey,
  });
});
