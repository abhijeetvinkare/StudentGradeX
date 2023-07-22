import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import videobg from "../../Admin/Pages/AdminLogin/SRTM.mp4";
import loginlogo from "../../Admin/Pages/AdminLogin/downloaddd.png";
import "../../Admin/Pages/AdminLogin/AdminHome.css";
// loading spinner
import Backdrop from "@mui/material/Backdrop";
import HashLoader from "react-spinners/HashLoader";

function TeacherLogin() {
  //page loading
  const [loading, setLoading] = useState(false);

  const [teacher, setTeacher] = useState({
    email: "",
    password: "",
  });

  function handlechange(event) {
    const { name, value } = event.target;
    setTeacher({
      ...teacher,
      [name]: value,
    });
  }

  let navigate = useNavigate();
  function handleClickNavigate() {
    navigate("/teacher-dashboard");
  }

  function loginSubmit(event) {
    let messageee = document.getElementById("messageee");
    event.preventDefault();
    setLoading(true);
    axios
      .post("http://localhost:5000/teacher/api/teacher-login", teacher)
      .then((res) => {
        if (res.data.message === "Login successful") {
          sessionStorage.setItem("_token", res.data.token);
          handleClickNavigate();
        } else if (res.data.message === "Password not match") {
          messageee.textContent = "incorrect password";
        } else {
          messageee.textContent = "No User Found!";
        }
      });
    setLoading(false);
  }

  // remove incoreect pass msg
  function reomvemsgInpass() {
    let messageee = document.getElementById("messageee");
    messageee.textContent = "";
  }

  return (
    <div className="AdminHome-main-container">
      <div className="overlay"></div>
      <video
        className="AdminHomeBgVideo"
        src={videobg}
        autoPlay
        loop
        muted
      ></video>
      <div className="admin-login-form-container">
        <div className="admin-login-form-div">
          <img className="loginLogo" src={loginlogo} alt="" />
          <p className="admin-login-text">Teacher Login</p>

          <div className="admin-login-details-main">
            <form onSubmit={loginSubmit} className="admin-login-details-sub">
              <input
                name="email"
                type="email"
                className="log-in-input-email login-input-fields"
                placeholder="Email"
                required
                onChange={(event) => {
                  handlechange(event);
                  reomvemsgInpass();
                }}
                value={teacher.email}
              />
              <input
                name="password"
                type="password"
                className="log-in-input-pass login-input-fields"
                placeholder="Password"
                autoComplete="off"
                required
                onChange={(event) => {
                  handlechange(event);
                  reomvemsgInpass();
                }}
                value={teacher.password}
              />
              <p className="pass-match-msg-log-in" id="messageee"></p>
              <button className="log-in-input-btn" type="submit">
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </div>
      <div>
        {loading ? (
          <Backdrop
            sx={{
              color: "#ffffff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: "rgb(0,0,0,0.8)",
            }}
            open
          >
            <HashLoader color="#1fcb4f" />
          </Backdrop>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default TeacherLogin;
