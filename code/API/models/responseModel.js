const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A response must have an associated doctor'],
    },
    associatedSurveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Survey',
      required: [true, 'A response must be associated with a survey'],
    },
    answers: [
      {
        type: mongoose.Schema.Types.Mixed, // Flexible structure for any question type
        required: true,
      },
    ],
  },
  { timestamps: true }
);
const Response = mongoose.model('Response', responseSchema);
module.exports = Response;
