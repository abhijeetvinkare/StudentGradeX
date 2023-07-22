const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  newclass: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NewClass = mongoose.model("newclass", classSchema);

module.exports = NewClass;
