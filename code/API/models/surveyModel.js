const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A Survey must have an associated doctor'],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    questions: [
      {
        type: mongoose.Schema.Types.Mixed, // Flexible structure for any question type
        required: true,
      },
    ],
  },
  { timestamps: true }
);
const Survey = mongoose.model('Survey', surveySchema);
module.exports = Survey;
