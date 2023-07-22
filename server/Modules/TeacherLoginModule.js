const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const TeacherSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
});

//Token Generate
TeacherSchema.methods.generateAuthtoken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, process.env.secretKey);
    this.token = token; // Replace existing tokens with the new token
    await this.save();
    return token;
  } catch (err) {
    throw new Error(err);
  }
};

const TeacherLoginModule = mongoose.model("teacherlogininfo", TeacherSchema);
module.exports = TeacherLoginModule;