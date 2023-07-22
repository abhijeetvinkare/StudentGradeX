const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subject_name: {
    type: String,
    required: true,
  },
  subject_code: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  min_marks: {
    type: Number,
    required: true,
  },
  max_marks: {
    type: Number,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  subject_type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Subject = mongoose.model("subject", subjectSchema);

module.exports = Subject;
