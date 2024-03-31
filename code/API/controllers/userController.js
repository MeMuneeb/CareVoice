const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getCurrentUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    user: req.user,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('No user found with that ID', 404));
  res.status(200).json({
    status: 'success',
    user,
  });
});
