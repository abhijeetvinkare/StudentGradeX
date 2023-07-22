const jwt = require("jsonwebtoken");

//Admin Module
const TeacherLoginModule = require("../Modules/TeacherLoginModule");

const authenticate_teacher = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const verifytoken = jwt.verify(token, process.env.secretKey);
    const user = await TeacherLoginModule.findOne({ _id: verifytoken._id });

    if (token === user.token) {
      req.token = token;
      req.user = user;
      req.user_id = user._id;

      // Update lastActivity timestamp and save the user document
      req.user.lastActivity = Date.now();
      await req.user.save();

      next();
    } else {
      throw new Error("Token not match!");
    }
  } catch (error) {
    res
      .status(401)
      .json({ message: "Authentication failed. " + error.message });
  }
};

module.exports = authenticate_teacher;
