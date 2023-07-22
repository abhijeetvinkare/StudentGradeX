import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Siderbar";
import Navbar from "../../Admin/Components/Navbar";
import "./AddResult.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GrFormCheckmark } from "react-icons/gr";
import Backdrop from "@mui/material/Backdrop";
import HashLoader from "react-spinners/HashLoader";

const semesters = [
  { year: "MCA I Year", sem: ["I", "II"] },
  { year: "MCA II Year", sem: ["III", "IV"] },
];

function AddResult() {
  const history = useNavigate();

  const [studentList, setStudentList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [SelectBatchYear, setSelectBatchYear] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [NewStudentFormData, setNewStudentFormData] = useState({
    studentname: "",
    classs: "",
    batchyear: "",
    semester: "",
    seatno: "",
    previousSeatNo: "",
    marks: [],
  });

  const [min_marks, setMinMarks] = useState("");
  const [max_marks, setMaxMarks] = useState("");
  const [subject_type, setSubjectType] = useState("");
  const [credits, setCredits] = useState("");

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const user_authentication = async () => {
    const token = sessionStorage.getItem("_token");
    const res = await fetch("/teacher/api/validateTeacher", {
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
      history("/teacher");
    }
  }, []);

  useEffect(() => {
    // Fetch students when the year changes
    setLoading(true);
    if (NewStudentFormData.classs && NewStudentFormData.batchyear) {
      // http://localhost:5000/api/students/MCA%20II%20Year/2022-2023
      axios
        .get(
          `http://localhost:5000/teacher/api/students/${NewStudentFormData.classs}/${NewStudentFormData.batchyear}`
        )
        .then((res) => {
          if (res.data.message === "no matching student found!") {
            alert("no matching student found!");
            setStudentList("");
            setIsButtonDisabled(true);
          } else {
            setStudentList(res.data);
            setIsButtonDisabled(false);
          }
        });
    }
    setLoading(false);
  }, [NewStudentFormData.batchyear, NewStudentFormData.classs]);

  useEffect(() => {
    setLoading(true);
    if (NewStudentFormData.semester) {
      // http://localhost:5000/api/get-subject-for-result?semester=III
      axios
        .get(
          `http://localhost:5000/teacher/api/get-subject-for-result?semester=${NewStudentFormData.semester}`
        )
        .then((res) => {
          if (res.data.message === "no matching subject found!") {
            alert("no matching subject found!");
            setSubjectList("");
            setIsButtonDisabled(true);
          } else {
            setSubjectList(res.data);
            setIsButtonDisabled(false);
          }
        });
    }
    setLoading(false);
  }, [NewStudentFormData.semester, NewStudentFormData.classs]);

  //page loading
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/api/get-classes"
      );
      setSelectBatchYear(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
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

  const handleSemesterChange = (event) => {
    setNewStudentFormData({
      ...NewStudentFormData,
      semester: event.target.value,
    });
  };

  const handleChange = (event) => {
    setNewStudentFormData({
      ...NewStudentFormData,
      studentname: event.target.value,
    });
  };

  const handleChangeSeat = (event) => {
    setNewStudentFormData({
      ...NewStudentFormData,
      seatno: event.target.value,
    });
  };

  const handlePreviousSeat = (event) => {
    setNewStudentFormData({
      ...NewStudentFormData,
      previousSeatNo: event.target.value,
    });
  };

  const handleSubjectChange = (event) => {
    const [selectedSubject, min_marks, max_marks, subject_type, credits] =
      event.target.value.split("|");
    setSelectedSubject(selectedSubject);
    setMinMarks(min_marks);
    setMaxMarks(max_marks);
    setSubjectType(subject_type);
    setCredits(credits);
  };
  const handleMarksChange = (event, type) => {
    const value = event.target.value;
    const subject = selectedSubject;
    const marks = NewStudentFormData.marks.slice();
    let index = marks.findIndex(
      (mark) => mark.subject.subject_name === subject
    );
    if (index === -1) {
      marks.push({
        subject: {
          subject_name: subject,
          subject_type: subject_type,
          min_marks: min_marks,
          max_marks: max_marks,
          credits: credits,
        },
        mark: {
          internal: type === "internal" ? value : "",
          external: type === "external" ? value : "",
        },
      });
    } else {
      marks[index] = {
        subject: {
          subject_name: subject,
          subject_type: subject_type,
          min_marks: min_marks,
          max_marks: max_marks,
          credits: credits,
        },
        mark: {
          internal: type === "internal" ? value : marks[index].mark.internal,
          external: type === "external" ? value : marks[index].mark.external,
        },
      };
    }
    setNewStudentFormData({ ...NewStudentFormData, marks: marks });
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

    axios
      .post(
        "http://localhost:5000/teacher/api/add-result",
        NewStudentFormData,
        config
      )
      .then((response) => {
        alert("Success!");
        setNewStudentFormData({ ...NewStudentFormData, marks: [] });
        setLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 409) {
          alert(error.response.data.error); // "Student with seat number ZX5454 already exists"
        } else if (error.response.status === 401) {
          // Authentication failed
          const { message } = error.response.data;
          // Display or handle the error message
          alert(message);
          history("/error");
        } else {
          alert("Marks for the Subject is Already Declared!");
        }
        setLoading(false);
      });
  };

  // Remove duplicates batchyear
  const uniqueYear = SelectBatchYear.filter(
    (year, index, self) => index === self.findIndex((s) => s.year === year.year)
  );

  const filteredSemesters =
    semesters.find((item) => item.year === NewStudentFormData.classs)?.sem ||
    [];

  return (
    <div className="add-result-main">
      <Sidebar />
      <div className="add-result-container">
        <Navbar />

        <div className="add-result-form-div-outer">
          <div className="add-result-form-div">
            <form
              action=""
              className="add-result-main-from-div"
              onSubmit={onformSubmit}
            >
              <div className="input-div-add-result">
                <label
                  htmlFor="classs"
                  className="lbl-class-add-result result-input-left-lbl"
                >
                  Class :
                </label>
                <select
                  className="add-result-select"
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

              <div className="input-div-add-result">
                <label
                  htmlFor="batchyear"
                  className="lbl-batch-add-result result-input-left-lbl"
                >
                  Batch Year : &#160;
                </label>
                <select
                  className="add-result-select"
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

              {studentList.length > 0 ? (
                <div>
                  <label
                    htmlFor="studentname"
                    className="lbl-studentname-add-result result-input-left-lbl"
                  >
                    Student Name :
                  </label>
                  <select
                    id="studentname"
                    name="studentname"
                    required
                    value={NewStudentFormData.studentname}
                    onChange={handleChange}
                    className="add-result-select"
                  >
                    <option value="">Select Student</option>
                    {studentList.map((student) => (
                      <option key={student._id} value={student.studentname}>
                        {student.studentname}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p></p>
              )}

              {studentList.length > 0 ? (
                <div className="input-div-add-result">
                  <label
                    htmlFor="semester"
                    className="lbl-sem-add-result result-input-left-lbl"
                  >
                    Select Semester :
                  </label>
                  <select
                    className="add-result-select"
                    id="add-result-semester"
                    name="semester"
                    value={NewStudentFormData.semester}
                    onChange={handleSemesterChange}
                    required
                  >
                    <option value=""> Select Semester </option>
                    {filteredSemesters.map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p></p>
              )}

              {studentList.length > 0 ? (
                <div className="input-div-current-seat">
                  <label
                    htmlFor=""
                    className="lbl-seatno-add-result result-input-left-lbl"
                  >
                    Exam Seat Number (Current Semester) :
                  </label>
                  <input
                    type="text"
                    name="studentname"
                    value={NewStudentFormData.seatno.toUpperCase()}
                    onChange={handleChangeSeat}
                    className="add-result-select"
                    required
                  />
                </div>
              ) : (
                <p></p>
              )}

              {studentList.length > 0 ? (
                <div>
                  {NewStudentFormData.semester === "II" ||
                  NewStudentFormData.semester === "IV" ? (
                    <div className="input-div-previous-seat">
                      <label
                        htmlFor="previousSeatNo"
                        className="lbl-seatno-add-result result-input-left-lbl"
                      >
                        Exam Seat Number (Previous Semester) :
                      </label>
                      <input
                        type="text"
                        className="add-result-select"
                        id="previous-seat-no"
                        name="previousSeatNo"
                        value={NewStudentFormData.previousSeatNo}
                        onChange={handlePreviousSeat}
                        required
                      />
                    </div>
                  ) : (
                    <p></p>
                  )}
                </div>
              ) : (
                <p></p>
              )}

              {studentList.length > 0 ? (
                <div>
                  {subjectList.length > 0 ? (
                    <div className="add-result-subject-container">
                      <hr className="dotted-hr" />
                      <p className="add-result-sub-p">SELECT SUBJECT :</p>

                      {subjectList.length > 0 ? (
                        <div className="add-result-select-subject-div">
                          <label
                            htmlFor="subject"
                            className="add-result-subject-lbl"
                          >
                            Select Subject:{" "}
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            onChange={handleSubjectChange}
                            className="select-dropdown-for-subject"
                            required
                          >
                            <option value="">Select a subject</option>
                            {subjectList.map((subject) => (
                              <option
                                key={subject._id}
                                value={`${subject.subject_name}|${subject.min_marks}|${subject.max_marks}|${subject.subject_type}|${subject.credits}`}
                                className="select-dropdown-for-subject-option"
                              >
                                {subject.subject_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  ) : (
                    <p></p>
                  )}

                  {selectedSubject && (
                    <div className="add-result-lbl-marks-div">
                      <hr className="dotted-hr" />
                      <p className="add-result-sub-p">ENTER MARKS :</p>
                      <label
                        htmlFor={selectedSubject}
                        className="add-result-subject-lbl"
                      >
                        SUBJECT : {selectedSubject}
                      </label>
                      <div className="add-result-int-ext-div">
                        <label
                          htmlFor="internal"
                          className="add-result-int-ext-lbl"
                        >
                          Internal Marks (CA) :
                        </label>
                        <input
                          className="input-field-for-int-marks"
                          min="0"
                          max={max_marks}
                          placeholder={`Out of ${max_marks}`}
                          required
                          type="number"
                          id="internal"
                          name="internal"
                          value={
                            NewStudentFormData.marks.find(
                              (mark) =>
                                mark.subject?.subject_name === selectedSubject
                            )?.mark.internal || ""
                          }
                          onChange={(event) =>
                            handleMarksChange(event, "internal")
                          }
                        />
                        {subject_type !== "OT" ? (
                          <div>
                            <label
                              htmlFor="external"
                              className="add-result-int-ext-lbl"
                            >
                              External Marks (ESE) :
                            </label>
                            <input
                              className="input-field-for-ext-marks"
                              min="0"
                              max={max_marks}
                              placeholder={`Out of ${max_marks}`}
                              required
                              type="number"
                              id="external"
                              name="external"
                              value={
                                NewStudentFormData.marks.find(
                                  (mark) =>
                                    mark.subject?.subject_name ===
                                    selectedSubject
                                )?.mark.external || ""
                              }
                              onChange={(event) =>
                                handleMarksChange(event, "external")
                              }
                            />
                          </div>
                        ) : (
                          <p></p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p></p>
              )}

              <div className="add-result-btn-div">
                <button
                  className={`createclass-btn-create ${
                    isButtonDisabled ? "disabled-button" : ""
                  }`}
                  disabled={isButtonDisabled}
                >
                  Submit <GrFormCheckmark size={25} />
                </button>
              </div>
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

export default AddResult;
