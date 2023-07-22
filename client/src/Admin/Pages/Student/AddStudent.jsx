import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import "./AddStudent.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// loading spinner
import Backdrop from "@mui/material/Backdrop";
import HashLoader from "react-spinners/HashLoader";

function AddStudent() {

  const [SelectBatchYear, setSelectBatchYear] = useState([]);
  const [NewStudentFormData, setNewStudentFormData] = useState({
    classs: "",
    batchyear: "",
    studentname: "",
    rollno: "",
    email: "",
    mobile: "",
  });

  //page loading
  const [loading, setLoading] = useState(false);

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
      history("/error")
    }
  };

  useEffect(() => {
    const _token = sessionStorage.getItem("_token");

    if (_token) {
      user_authentication();
    }else{
      history("/admin")
    }
  
  }, []);

  const getData = async() =>{
    try{
        const response = await axios.get('http://localhost:5000/admin/api/get-classes');
        setSelectBatchYear(response.data)
    }catch(error){
      console.log(error);
    }
  }
  useEffect(() => {
    getData()
  }, []);
  
  // event handler for static select option change
  const handleStaticOptionChange = (event) => {
    const { name, value } = event.target;
    setNewStudentFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // event handler for dynamic select option change
  const handleDynamicOptionChange = (event) => {
    const { name, value } = event.target;
    setNewStudentFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudentFormData((prevData) => ({ ...prevData, [name]: value}));
  };

  const handleChangeName = (e) => {
    const { name, value } = e.target;
    setNewStudentFormData((prevData) => ({ ...prevData, [name]: value.toUpperCase() }));
  };

  const onformSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    
    const token = sessionStorage.getItem("_token");
    const config = {
      headers: {
        Authorization: token,
      },
    };

    axios.post("http://localhost:5000/admin/api/add-student", NewStudentFormData, config)
      .then((res) => {
        if(res.data.message === "AlredyPresent!"){
          alert('AlredyPresent!')
        }else if(res.data.message === "Roll Present!"){
          alert('Roll Present!')
        }else{
          alert('Success!')
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
    setLoading(false);
  };

    // Remove duplicates batchyear
    const uniqueYear = SelectBatchYear.filter((year, index, self) =>
    index === self.findIndex(s => s.year === year.year)
  );


  return (
    <div className="add-student-main">
      <Sidebar />
      <div className="add-student-container">
        <Navbar />
        <div className="add-student-form-div">
          <div className="add-student-div">
            <div className="add-student-box">
              <form
                action=""
                className="add-student-form"
                onSubmit={onformSubmit}
              >
                <div className="input-div-add-student">
                  <label htmlFor="classs" className="lbl-class">
                    Class :
                  </label>
                  <select
                    className="add-student-select"
                    id="classs"
                    name="classs"
                    value={NewStudentFormData.classs}
                    onChange={handleStaticOptionChange}
                    required
                  >
                    <option value=""> Select Class </option>
                    <option value="MCA I Year">MCA I Year</option>
                    <option value="MCA II Year">MCA II Year</option>
                  </select>
                </div>
                <div className="input-div-add-student">
                  <label htmlFor="batchyear" className="lbl-batch">
                    Batch Year :
                  </label>
                  <select
                    className="add-student-select"
                    id="batchyear"
                    name="batchyear"
                    required
                    value={NewStudentFormData.batchyear}
                    onChange={handleDynamicOptionChange}
                  >
                    <option value=""> Select Batch </option>
                    {uniqueYear.map((option) => (
                      <option key={option._id} value={option.year}>
                        {option.year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-div-add-student">
                  <label htmlFor="" className="lbl-name">
                    Student Name :{" "}
                  </label>
                  <input
                    type="text"
                    name="studentname"
                    value={NewStudentFormData.studentname.toUpperCase()}
                    onChange={handleChangeName}
                    className="add-student-input-box"
                    required
                  />
                </div>
                <div className="input-div-add-student-roll">
                  <label htmlFor="" className="lbl-roll">
                    Roll No. :
                  </label>
                  <input
                    type="text"
                    className="add-student-input-box"
                    required
                    name="rollno"
                    value={NewStudentFormData.rollno}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-div-add-student-email">
                  <label htmlFor="" className="lbl-email">
                    Email :
                  </label>
                  <input
                    type="email"
                    className="add-student-input-box"
                    required
                    name="email"
                    value={NewStudentFormData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-div-add-student">
                  <label htmlFor="" className="lbl-mobile">
                    Mobile :
                  </label>
                  <input
                    type="number"
                    className="add-student-input-box"
                    required
                    name="mobile"
                    value={NewStudentFormData.mobile}
                    onChange={handleChange}
                  />
                </div>
                <div className="add-student-btn-div">
                  <button className="createclass-btn-create">Submit</button>
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

export default AddStudent;
