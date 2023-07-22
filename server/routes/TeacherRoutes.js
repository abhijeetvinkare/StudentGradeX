const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Teacher Module
const TeacherLoginModule = require("../Modules/TeacherLoginModule");
const Student = require("../Modules/Student");
const Subject = require("../Modules/subject");
const Results = require("../Modules/Results");
const authenticate_teacher = require("../Middleware/authenticate_teacher");

// Teacher login authentication
router.post("/api/teacher-login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await TeacherLoginModule.findOne({ email: email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = await user.generateAuthtoken();
        res.json({ message: "Login successful", token });
      } else {
        res.send({ message: "Password not match" });
      }
    } else {
      res.send({ message: "User not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
});

//authenticate
router.get("/api/validateTeacher", authenticate_teacher, async (req, res) => {
  try {
    const validadmin = await TeacherLoginModule.findOne({ _id: req.user_id });
    res.status(201).json({ message: "Success!User_Valid!" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

// Teacher logout
router.post("/api/teacher-logout", authenticate_teacher, async (req, res) => {
  try {
    const user = req.user;
    user.lastActivity = Date.now();
    await user.save();
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Change Teacher Password
router.put(
  "/api/change-teacher-pass",
  authenticate_teacher,
  async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
      // find the user by ID
      const user = await TeacherLoginModule.findById({ _id: req.user_id });
      if (!user) {
        return res.status(404).send("User not found");
      }
      // check if the old password matches the one in the database
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) {
        return res.send("Old password is incorrect");
      }

      // check if the new password is the same as the old password
      const matchOld = await bcrypt.compare(newPassword, user.password);
      if (matchOld) {
        return res.send("New password must be different");
      }

      // update the user's password
      user.password = await bcrypt.hash(newPassword, 10); // Hash the new password
      await user.save();

      res.send("Password updated successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating password");
    }
  }
);

// API endpoint to get student of the specific batch n class
router.get("/api/students/:classs/:batchyear", async (req, res) => {
  // const { classs, batchyear } = req.params;

  const classs = req.params.classs;
  const batchyear = req.params.batchyear;

  const students = await Student.find({ classs, batchyear });

  if (students.length === 0) {
    res.send({ message: "no matching student found!" });
  } else {
    res.json(students);
  }
});

// API endpoint to get the subject of the perticular semester to give the marks
router.get("/api/get-subject-for-result", async (req, res) => {
  const semester = req.query.semester;

  const students = await Subject.find({ semester });

  if (students.length === 0) {
    res.send({ message: "no matching subject found!" });
  } else {
    res.json(students);
  }
});

// Result
router.post("/api/add-result", authenticate_teacher, async (req, res) => {
  const {
    studentname,
    batchyear,
    classs,
    subject,
    marks,
    seatno,
    previousSeatNo,
    semester,
  } = req.body;

  try {
    const existingResult = await Results.findOne({ seatno });

    if (existingResult) {
      // If a document exists, check if the marks array already contains an object with the same subject
      const existingMark = existingResult.marks.find(
        (mark) => mark.subject.subject_name === marks[0].subject.subject_name
      );

      if (existingMark) {
        return res.status(400).json({
          message: "This subject is already present in the marks object.",
        });
      } else {
        // If the marks array does not already contain an object with the same subject, push the new object to the array
        existingResult.marks.push({
          subject: marks[0].subject,
          mark: marks[0].mark,
        });
        await existingResult.save();
        return res.status(201).json({ message: "Marks added successfully." });
      }
    } else {
      // Create a new student document in the database
      const student = new Results({
        studentname,
        batchyear,
        classs,
        subject,
        marks,
        seatno,
        previousSeatNo,
        semester,
      });
      await student.save();
      res.json(student);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Result
router.delete(
  "/api/delete-result/:id",
  authenticate_teacher,
  async (req, res) => {
    try {
      const deletedData = await Results.findByIdAndDelete(req.params.id);
      if (!deletedData) {
        return res.send({ message: "NotFound!" });
      }

      res.send({ message: "Success!" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  }
);

module.exports = router;
