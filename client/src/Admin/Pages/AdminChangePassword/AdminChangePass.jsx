import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import "./ChangePass.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// loading spinner
import Backdrop from "@mui/material/Backdrop";
import HashLoader from "react-spinners/HashLoader";

function AdminChangePass() {
  //page loading
  const [loading, setLoading] = useState(false);

  const [oldPassword, setOldPass] = useState("");
  const [newPassword, setNewpass] = useState("");
  const [re_typePass, setRe_typePass] = useState("");

  const history = useNavigate();

  const user_authentication = async () => {
    const token = sessionStorage.getItem("_token");

    const res = await fetch("/admin/api/validateAdmin", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await res.json();

    if (data.message !== "Success!User_Valid!") {
      history("/error");
    }
  };

  useEffect(() => {
    const _token = sessionStorage.getItem("_token");

    if (_token) {
      user_authentication();
    } else {
      history("/admin");
    }
  }, []);

  function submitpass(event) {
    setNewpass(event.target.value);
  }
  function submitpassconf(event) {
    setRe_typePass(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true);

    const token = sessionStorage.getItem("_token");
    const config = {
      headers: {
        Authorization: token,
      },
    };

    axios
      .put(
        "http://localhost:5000/admin/api/change-admin-pass",
        { oldPassword, newPassword },
        config
      )
      .then((res) => {
        if (res.data === "Old password is incorrect") {
          alert("Old password is incorrect");
          setOldPass("");
          setNewpass("");
          setRe_typePass("");
        } else if (res.data === "New password must be different") {
          alert(
            "Password must be different from your previous password. Please choose a new, unique password."
          );
          setNewpass("");
          setRe_typePass("");
        } else{
          alert("Password updated successfully");
          setOldPass("");
          setNewpass("");
          setRe_typePass("");
          message.textContent = "";
        }
      });
    setLoading(false);
  };

  let message = document.getElementById("message");
  // confirm password code
  function checkPassword() {
    let password = document.getElementById("password").value;
    let cnfrmPassword = document.getElementById("cnfrm-password").value;
    let message = document.getElementById("message");
    let admin_change_pass_btn = document.getElementById(
      "admin_change_pass_btn"
    );

    if (password.length !== 0) {
      if (password === cnfrmPassword) {
        message.textContent = "New Password & Re-type Password Match ✔";
        message.style.color = "#1dcd59";
        document.getElementById("admin_change_pass_btn").disabled = false;
        admin_change_pass_btn.style.cursor = "pointer";
        admin_change_pass_btn.style.backgroundColor = "#d5f365";
      } else {
        message.textContent = "New Password & Re-type Password doesn't Match!";
        message.style.color = "#ff4d4d";
        admin_change_pass_btn.style.cursor = "no-drop";
        admin_change_pass_btn.style.backgroundColor = "#d5f365";
        document.getElementById("admin_change_pass_btn").disabled = true;
      }
    }
    if (password.length === 0) {
      message.textContent = "";
      admin_change_pass_btn.style.backgroundColor = "#d5f365";
    }
  }

  return (
    <div className="dashboard-main">
      <Sidebar />
      <div className="dashboard-container">
        <Navbar />
        <div className="createclasses-form-div">
          <div id="admin-changepass-box1" className="createclasses-div">
            <div id="admin-changepass-box2" className="createclass-box">
              <form
                action=""
                className="admin-changepass-formdiv"
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="lbl-oldpass adminpass-lbl">
                    Old Password :{" "}
                  </label>
                  <input
                    type="text"
                    className="admin-changepass-input-box"
                    placeholder="Old-Password"
                    value={oldPassword}
                    onChange={(e) => setOldPass(e.target.value)}
                    required
                  />
                </div>
                <div className="admin-newpass-div">
                  <label className="lbl-newpass adminpass-lbl">
                    New Password :{" "}
                  </label>
                  <input
                    className="admin-changepass-input-box"
                    id="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="off"
                    required
                    onChange={(event) => {
                      submitpass(event);
                      checkPassword();
                    }}
                    value={newPassword}
                  />
                </div>
                <div>
                  <label className="lbl-re-pass adminpass-lbl">
                    Re-type Password :{" "}
                  </label>
                  <input
                    type="text"
                    className="admin-changepass-input-box"
                    placeholder="Confirm-Password"
                    id="cnfrm-password"
                    autoComplete="off"
                    required
                    onChange={(event) => {
                      submitpassconf(event);
                      checkPassword();
                    }}
                    value={re_typePass}
                  />
                </div>
                <p className="pass-match-msg" id="message"></p>
                <div className="admin-changepass-btn-div">
                  <button
                    id="admin_change_pass_btn"
                    className="createclass-btn-create"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
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

export default AdminChangePass;
