import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { FiLogOut } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
// loading spinner
import Backdrop from "@mui/material/Backdrop";
import HashLoader from "react-spinners/HashLoader";

function Navbar() {
  //page loading
  const [loading, setLoading] = useState(false);

  const [pageName, setPageName] = useState("");

  useEffect(() => {
    const pathname = window.location.pathname;
    const pageName = pathname.substring(pathname.lastIndexOf("/") + 1);
    setPageName(pageName);
  }, []);

  let heading;
  if (pageName === "create-classes") {
    heading = "Create New Class";
  } else if (pageName === "manage-classes") {
    heading = "Manage Classes";
  } else if (pageName === "create-subject") {
    heading = "Create New Subject";
  } else if (pageName === "manage-subject") {
    heading = "Manage Subject";
  } else if (pageName === "subject-combination") {
    heading = "Create Subject Combination";
  } else if (pageName === "manage-subject-combination") {
    heading = "Manage Subject Combination";
  } else if (pageName === "add-student") {
    heading = "New Student";
  } else if (pageName === "manage-student") {
    heading = "Manage Student";
  } else if (pageName === "add-result") {
    heading = "Add Result";
  } else if (pageName === "manage-result") {
    heading = "Manage Result";
  } else if (pageName === "teacher-change-pass") {
    heading = "Change Password";
  } else if (pageName === "admin-change-pass") {
    heading = "Change Password";
  } else {
    heading = "Dashboard";
  }

  let navigate = useNavigate();
  const location = useLocation();

  const LogoutAdmin = async () => {
    try {
      const token = sessionStorage.getItem("_token");
      const response = await fetch("admin/api/admin-logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.ok) {
        // Logout successful
        sessionStorage.removeItem("_token");
        // Redirect to login page or perform any other necessary action
        navigate("/admin");
      } else {
        // Logout failed
        const data = await response.json();
        alert(data.message);
        navigate("/error");
      }
    } catch (error) {
      console.log(error);
      // Handle any network or server errors
    }
  };

  const LogoutTeacher = async () => {
    try {
      const token = sessionStorage.getItem("_token");
      const response = await fetch("teacher/api/teacher-logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.ok) {
        sessionStorage.removeItem("_token");
        navigate("/teacher");
      } else {
        const data = await response.json();
        alert(data.message);
        navigate("/error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    setLoading(true);

    const { pathname } = location;

    if (
      pathname.includes("/add-result") ||
      pathname.includes("/manage-result") ||
      pathname.includes("/teacher-dashboard") ||
      pathname.includes("/teacher-change-pass")
    ) {
      LogoutTeacher();
    } else {
      LogoutAdmin();
    }

    setLoading(false);
  };

  return (
    <>
      <div className="navbar-main-div">
        <div className="navbar-heading-div">
          <h1 className="navbar-heading">{heading.toUpperCase()}</h1>
        </div>
        <div className="navbar-logout-btn-div">
          <div className="navbar-logut-box">
            <button className="navbar-logout-btn" onClick={handleLogout}>
              <FiLogOut size={20} /> &#160;Logout
            </button>
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
    </>
  );
}

export default Navbar;
