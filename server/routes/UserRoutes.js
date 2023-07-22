const express = require("express");
const router = express.Router();

//User Module
const Results = require("../Modules/Results");

router.get("/api/get-result", (req, res) => {
  Results.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

// Route handler for POST /api/student-result-studentseatno
router.get("/api/student-result-studentseatno", async (req, res) => {
  try {
    // Extract seatno from request body
    const { seatno } = req.query;

    // Find the result with matching seatno using Mongoose
    const result = await Results.findOne({ seatno });

    // If result found, return it with success message
    if (result) {
      res.json({ message: "Successful", result });
    } else {
      // Otherwise, return error message
      res.status(404).json({ message: "Result not found" });
    }
  } catch (error) {
    console.error("Error finding student result by seatno", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
