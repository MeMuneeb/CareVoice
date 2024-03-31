const catchAsync = require('./../utils/catchAsync');
const Survey = require('./../models/surveyModel');
const Response = require('./../models/responseModel');
const AppError = require('../utils/appError');

exports.createResponse = catchAsync(async (req, res, next) => {
  const response = await Response.create(req.body);
  res.status(201).json({
    status: 'success',
    response,
  });
});
exports.getResponse = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const response = await Response.findById(id);
  if (!response) {
    return next(new AppError('No response found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    response,
  });
});
exports.getAllResponsesForDoctor = catchAsync(async (req, res, next) => {
  const doctorId = req.user.id;
  const surveys = await Survey.find({ doctorId: doctorId });

  if (!surveys.length) {
    return next(new AppError('No surveys found for this doctor', 404));
  }

  const surveyResponses = (
    await Promise.all(
      surveys.map(async (survey) => {
        const responses = await Response.find({
          associatedSurveyId: survey.id,
        }).populate('patientId', 'name'); // Populate patient's name

        if (responses.length > 0) {
          return { survey: survey, responses: responses };
        }
        return null;
      })
    )
  ).filter((response) => response !== null);

  if (!surveyResponses.length) {
    return next(new AppError('No responses found for this doctor', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      surveyResponses,
    },
  });
});
