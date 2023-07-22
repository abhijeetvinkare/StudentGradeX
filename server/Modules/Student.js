const mongoose = require("mongoose");
const StudentSchema = new mongoose.Schema({
  classs: {
    type: String,
  },
  batchyear: {
    type: String,
  },
  studentname: {
    type: String,
  },
  rollno: {
    type: String,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Student = mongoose.model("student", StudentSchema);
module.exports = Student;
