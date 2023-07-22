const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = express();
app.use(express.json());
const path = require("path");
const cors = require("cors");
app.use(cors());

const connectDB = require("./Config/db");
connectDB();

// Import route files
const AdminRoutes = require("./routes/AdminRoutes");
const TeacherRoutes = require("./routes/TeacherRoutes");
const UserRoutes = require("./routes/UserRoutes");
const DashboardCountRoute = require("./routes/DashboardCountRoute");

// Use routes
app.use("/admin", AdminRoutes);
app.use("/teacher", TeacherRoutes);
app.use("/user", UserRoutes);
app.use("/count", DashboardCountRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


