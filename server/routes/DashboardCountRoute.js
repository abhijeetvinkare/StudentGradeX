const express = require("express");
const router = express.Router();

// Required Modules
const NewClass = require("../Modules/newclass");
const Subject = require("../Modules/subject");
const Student = require("../Modules/Student");
const Results = require("../Modules/Results");

// dahsboard coutning api requests

// Define an API endpoint that returns the count of documents in the "students" collection
router.get("/api/students/count", async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.json({ count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error counting documents" });
  }
});

// Define an API endpoint that returns the count of documents in the "students" collection
router.get("/api/subject/count", async (req, res) => {
  try {
    const count = await Subject.countDocuments();
    res.json({ count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error counting documents" });
  }
});

// Define an API endpoint that returns the count of documents in the "students" collection
router.get("/api/class/count", async (req, res) => {
  try {
    const count = await NewClass.countDocuments();
    res.json({ count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error counting documents" });
  }
});

// Define an API endpoint that returns the count of documents in the "students" collection
router.get("/api/results/count", async (req, res) => {
  try {
    const count = await Results.countDocuments();
    res.json({ count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error counting documents" });
  }
});

module.exports = router;
