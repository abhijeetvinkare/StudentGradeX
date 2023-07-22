const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

//Admin Module
const AdminLoginModule = require("../Modules/AdminLoginModule");
const NewClass = require("../Modules/newclass");
const Subject = require("../Modules/subject");
const Student = require("../Modules/Student");
//authenticate
const authenticate = require("../Middleware/authenticate");

// Admin login authentication
router.post("/api/admin-login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AdminLoginModule.findOne({ email: email });

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


router.get("/api/validateAdmin", authenticate, async (req, res) => {
  try {
    const validadmin = await AdminLoginModule.findOne({ _id: req.user_id });
    res.status(201).json({ message: "Success!User_Valid!" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

// Admin plus Teacher logout
router.post("/api/admin-logout", authenticate, async (req, res) => {
  try {
    const user = req.user;
    user.lastActivity = Date.now();
    await user.save();
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Creating new class

router.post("/api/create-class", authenticate, async (req, res) => {
  
  const CreateClassFormData = req.body;

  const newclass = CreateClassFormData.classs;
  const year = CreateClassFormData.batchyear;

  // Check if student already exists in database
  const existingStudent = await NewClass.findOne({ newclass, year });
  if (existingStudent) {
    res.send({ message: "AlredyPresent!" });
  } else {
    // Create new student and save to database
    const newClass = new NewClass({ newclass, year });
    await newClass.save();

    res.send({ message: "Created Successfully!" });
  }
});

//Creating Subject

router.post("/api/create-subject", authenticate, async (req, res) => {
  const {
    subject_name,
    subject_code,
    semester,
    min_marks,
    max_marks,
    credits,
    subject_type,
  } = req.body;

  // Check if student already exists in database
  const existingSubject = await Subject.findOne({ subject_code, semester });
  if (existingSubject) {
    res.send({ message: "AlredyPresent!" });
  } else {
    // Create new student and save to database
    const newSubject = new Subject({
      subject_name,
      subject_code,
      semester,
      min_marks,
      max_marks,
      credits,
      subject_type,
    });
    await newSubject.save();

    res.send({ message: "Created Successfully!" });
  }
});

//Add Student

router.post("/api/add-student", authenticate, async (req, res) => {
  const { classs, batchyear, studentname, rollno, email, mobile } = req.body;

  // Check if student already exists in database
  const existingStudent = await Student.findOne({ rollno, classs, batchyear });
  if (existingStudent) {
    res.send({ message: "AlredyPresent!" });
  } else {
    // Create new student and save to database
    const newStudent = new Student({
      classs,
      batchyear,
      studentname,
      rollno,
      email,
      mobile,
    });
    await newStudent.save();

    res.send({ message: "Created Successfully!" });
  }
});

//getting all subject
router.get("/api/get-subject", (req, res) => {
  Subject.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

//getting all Classes
router.get("/api/get-classes", (req, res) => {
  NewClass.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

//getting all Students
router.get("/api/get-students", (req, res) => {
  Student.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

// Delete Students
router.delete("/api/delete-student/:id", authenticate, async (req, res) => {
  try {
    const deletedData = await Student.findByIdAndDelete(req.params.id);
    if (!deletedData) {
      res.send({ message: "NotFound!" });
    }
    res.send({ message: "Success!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

// Delete Subjects
router.delete("/api/delete-subject/:id", authenticate, async (req, res) => {
  try {
    const deletedData = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedData) {
      res.send({ message: "NotFound!" });
    }
    res.send({ message: "Success!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

// Delete Classes
router.delete("/api/delete-class/:id", authenticate, async (req, res) => {
  try {
    const deletedData = await NewClass.findByIdAndDelete(req.params.id);
    if (!deletedData) {
      res.send({ message: "NotFound!" });
    }
    res.send({ message: "Success!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

//Change Admin Password
router.put("/api/change-admin-pass", authenticate, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    // find the user by ID
    const user = await AdminLoginModule.findById({ _id: req.user_id });
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
});

module.exports = router;
