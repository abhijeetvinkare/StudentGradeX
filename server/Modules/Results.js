const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  studentname: {
    type: String,
  },
  batchyear: {
    type: String,
  },
  classs: {
    type: String,
  },
  seatno: {
    type: String,
  },
  previousSeatNo : {
    type: String,
  },
  semester: {
    type: String,
  },
  marks: [
    {
      subject: {
        subject_name: {
          type: String,
        },
        subject_type: {
          type: String,
        },
        min_marks: {
          type: Number,
        },
        max_marks: {
          type: Number,
        },
        credits: {
          type: Number,
        },
      },
      mark: {
        internal: {
          type: Number,
        },
        external: {
          type: Number,
        },
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Results", resultSchema);
