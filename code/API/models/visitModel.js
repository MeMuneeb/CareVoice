const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A visit must have an associated doctor"],
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A visit must have an associated patient"],
  },
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: false,
  },
  visitDate: {
    type: Date,
    default: Date.now(),
  },
});
const Visit = mongoose.model("Visit", visitSchema);
module.exports = Visit;
