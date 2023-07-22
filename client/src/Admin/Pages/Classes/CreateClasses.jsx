import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";
import "./CreateClasses.css";
import { SelectBatchYear } from "./SelectBatchYear";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function CreateClasses() {
  const [CreateClassFormData, setCreateClassFormData] = useState({
    classs: "",
    batchyear: "",
  });

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

  // event handler for static select option change
  const handleStaticOptionChange = (event) => {
    const { name, value } = event.target;
    setCreateClassFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // event handler for dynamic select option change
  const handleDynamicOptionChange = (event) => {
    const { name, value } = event.target;
    setCreateClassFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const CreateClassFormSubmit = (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("_token");
    const config = {
      headers: {
        Authorization: token,
      },
    };

    axios
      .post(
        "http://localhost:5000/admin/api/create-class",
        CreateClassFormData,
        config
      )
      .then((res) => {
        if (res.data.message === "AlredyPresent!") {
          Swal.fire({
            background: "#1A1A1A",
            title: "Already Present! 👀",
            text: "class is already present !",
            icon: "error",
          });
        } else {
          Swal.fire({
            background: "#1A1A1A",
            title: "Success! 😎",
            text: "Class Created Successfully !",
            icon: "success",
          });
        }
      })
      .catch((error) => {
        if (error) {
          // Authentication failed
          const { message } = error.response.data;
          // Display or handle the error message
          alert(message);
          history("/error");
        }
      });
  };

  return (
    <div className="createclasses-main">
      <Sidebar />
      <div className="createclasses-container">
        <Navbar />
        <div className="createclasses-form-div">
          <div className="createclasses-div">
            <div className="createclass-box">
              <form
                onSubmit={CreateClassFormSubmit}
                className="create-class-form-div"
              >
                <label htmlFor="classs" className="createclass-box-lable">
                  Select Class :
                </label>
                <select
                  id="classs"
                  name="classs"
                  value={CreateClassFormData.classs}
                  onChange={handleStaticOptionChange}
                  required
                  className="createclass-bx-select1"
                >
                  <option value=""> Select Class </option>
                  <option value="MCA I Year">MCA I Year</option>
                  <option value="MCA II Year">MCA II Year</option>
                </select>

                <label htmlFor="batchyear" className="createclass-box-lable">
                  Select Batch Starting Year :
                </label>
                <select
                  id="batchyear"
                  name="batchyear"
                  value={CreateClassFormData.batchyear}
                  onChange={handleDynamicOptionChange}
                  required
                  className="createclass-bx-select2"
                >
                  <option value=""> Select Batch Starting Year </option>
                  {SelectBatchYear.map((option) => (
                    <option key={option._id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button type="submit" className="createclass-btn-create">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateClasses;
