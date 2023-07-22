import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import "./CreateSubject.css";
import { useNavigate } from "react-router-dom";

function CreateSubject() {
  const [subject_name, setSubjectName] = useState("");
  const [subject_code, setSubjectCode] = useState("");
  const [semester, setSemester] = useState("");
  const [min_marks, setMinMarks] = useState("");
  const [max_marks, setMaxMarks] = useState("");
  const [credits, setCredits] = useState("");
  const [subject_type, setSubjectType] = useState('TH');


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


  const handleOptionChange = (e) => {
    setSubjectType(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const token = sessionStorage.getItem("_token");
    const config = {
      headers: {
        Authorization: token,
      },
    };

    axios
      .post("http://localhost:5000/admin/api/create-subject", {
        subject_name,
        subject_code,
        semester, 
        min_marks, 
        max_marks, 
        credits, 
        subject_type
      },config)
      .then((res) => {
        if (res.data.message === "AlredyPresent!") {
          alert("AlredyPresent!");
        } else {
          alert("Success!");
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
    <div className="create-subject-main">
      <Sidebar />
      <div className="create-subject-container">
        <Navbar />
        <div className="create-subject-form-div">
          <div className="card">
            <div className="card2">
              <form onSubmit={handleSubmit} className="create-sub-form-div">
                <label className="create-sub-lbl">
                  Subject Name :
                  <input
                    className="create-sub-input"
                    type="text"
                    value={subject_name}
                    onChange={(e) =>
                      setSubjectName(e.target.value.toUpperCase())
                    }
                    required
                  />
                  <span className="form-ex-span">
                    Example : Python Programming
                  </span>
                </label>
                <br />
                <label className="create-sub-lbl2">
                  Subject Code :
                  <input
                    className="create-sub-input"
                    type="subject_code"
                    value={subject_code}
                    onChange={(e) =>
                      setSubjectCode(e.target.value.toUpperCase())
                    }
                    required
                  />
                  <span className="form-ex-span">Example : MCA-R303</span>
                </label>
                <br />
                <label className="create-sub-lbl2">
                  Semester :
                  <select
                    id="semester"
                    name="semester"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                  >
                    <option value=""> Select Semester </option>
                    <option value="I">MCA I Semester</option>
                    <option value="II">MCA II Semester</option>
                    <option value="III">MCA III Semester</option>
                    <option value="IV">MCA IV Semester</option>
                  </select>
                </label>
                <br />
                <label className="create-sub-lbl2">
                  Enter Minimum Marks for the Subject (MIN) :
                  <input
                    className="create-sub-input"
                    type="number"
                    value={min_marks}
                    onChange={(e) =>
                      setMinMarks(e.target.value)
                    }
                    required
                  />
                </label>
                <br />
                <label className="create-sub-lbl2">
                Enter Maximum Marks for the Subject (MAX) :
                  <input
                    className="create-sub-input"
                    type="number"
                    value={max_marks}
                    onChange={(e) =>
                      setMaxMarks(e.target.value)
                    }
                    required
                  />
                </label>
                <br />
                <label className="create-sub-lbl2">
                Enter Credits of the Subject :
                  <input
                    className="create-sub-input"
                    type="number"
                    value={credits}
                    onChange={(e) =>
                      setCredits(e.target.value)
                    }
                    required
                  />
                </label>
                <br />
                <div className="crt-sub-radio-div">
                <label className="create-sub-lblsubtype"> Select Subject Type : &#160; </label> 
                <div className="crt-sub-radio-div2">
                <label>
                    <input
                      type="radio"
                      value="TH"
                      checked={subject_type === "TH"}
                      onChange={handleOptionChange}
                    />
                    Theory &#160;
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="PR"
                      checked={subject_type === "PR"}
                      onChange={handleOptionChange}
                    />
                    Practicle &#160;
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="OT"
                      checked={subject_type === "OT"}
                      onChange={handleOptionChange}
                    />
                    Other &#160;
                  </label>
                  </div>
                </div>
                <br />
                <button type="submit" className="createsubject-btn-create">
                  Submit
                </button>
                <br />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSubject;
