import React from "react";
import videobg from "../../Admin/Pages/AdminLogin/SRTM.mp4";
import loginlogo from "../../Admin/Pages/AdminLogin/downloaddd.png";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import HashLoader from "react-spinners/HashLoader";
import "./UserHome.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserHome() {

  const [seatno, setSeatno] = useState("");
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();
  function handleClickNavigate() {
    navigate("/final-result");
  }

// Handle button click event
const handleButtonClick = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Send POST request to server with seatno
      const response = await axios.get(`http://localhost:5000/user/api/student-result-studentseatno?seatno=${seatno}`)
  
      // If server response is successful, display the result to user
      if (response.data.message === 'Successful') {
        const result = response.data.result;
        handleClickNavigate()
        sessionStorage.setItem("user-info", JSON.stringify(result));
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      console.error('Error retrieving result:', error.message);
      alert("Result Not Found!")
    }
    setLoading(false)
  };

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
        <div className="user-home-form-div">
          <img className="loginLogo" src={loginlogo} alt="" />
          <p className="admin-login-text">Results</p>
          <div className="admin-login-details-main">
            <form onSubmit={handleButtonClick} className="admin-login-details-sub">
              <div className="seatinput-div">
                <label className="user-home-seat-lbl">
                  Enter Your Seat Number 👇
                </label>
                <input
                  type="text"
                  className="user-home-input-seatno"
                  placeholder="Example : ZY5454"
                  value={seatno}
                  onChange={(e) => setSeatno(e.target.value.toUpperCase())}
                  required
                />
              </div>
              <button className="result-submit-input-btn" type="submit">
                SUBMIT
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

export default UserHome;
