import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { BsFillPeopleFill, BsPencilSquare } from "react-icons/bs";
import { SiGoogleclassroom } from "react-icons/si";
import { ImClipboard } from "react-icons/im";
import CountUp from "react-countup";
import axios from "axios";

function Dashboard() {
  const [studentCount, setStudentCount] = useState("");
  const [subjectCount, setSubjectCount] = useState("");
  const [classCount, setClassCount] = useState("");
  const [resultCount, setResultCount] = useState("");


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


  useEffect(() => {
    axios
      .get("/count/api/students/count")
      .then((res) => setStudentCount(res.data.count))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("/count/api/subject/count")
      .then((res) => setSubjectCount(res.data.count))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("/count/api/class/count")
      .then((res) => setClassCount(res.data.count))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("/count/api/results/count")
      .then((res) => setResultCount(res.data.count))
      .catch((err) => console.log(err));
  }, []);



  return (
    <div className="dashboard-main">
      <Sidebar />
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-div">
          <div className="dashboard-heading-div">
            {" "}
            <h1 className="dashboard-heading">Welcome!</h1>{" "}
          </div>
          <div className="counter-cards-main">
            <div className="counter-cards-box">
              <div className="counter-cards-div">
                <div className="counter-card-logo">
                  <BsFillPeopleFill size={80} />
                </div>
                <div className="counter-number-div">
                  <div>
                    <CountUp
                      delay={0.1}
                      end={studentCount}
                      duration={2.75}
                      className="number-count"
                    />
                  </div>
                  <div>
                    <p className="counter-card-p">Total Students</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="counter-cards-box">
              <div className="counter-cards-div">
                <div className="counter-card-logo">
                  <BsPencilSquare size={80} />
                </div>
                <div className="counter-number-div">
                  <div>
                    <CountUp
                      delay={0.1}
                      end={subjectCount}
                      duration={2.75}
                      className="number-count"
                    />
                  </div>
                  <div>
                    <p className="counter-card-p">Subjects Listed</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="counter-cards-box">
              <div className="counter-cards-div">
                <div className="counter-card-logo">
                  <SiGoogleclassroom size={80} />
                </div>
                <div className="counter-number-div">
                  <div>
                    <CountUp
                      delay={0.1}
                      end={classCount}
                      duration={2.75}
                      className="number-count"
                    />
                  </div>
                  <div>
                    <p className="counter-card-p">Classes Listed</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="counter-cards-box">
              <div className="counter-cards-div">
                <div className="counter-card-logo">
                  <ImClipboard size={80} />
                </div>
                <div className="counter-number-div">
                  <div>
                    <CountUp
                      delay={0.1}
                      end={resultCount}
                      duration={2.75}
                      className="number-count"
                    />
                  </div>
                  <div>
                    <p className="counter-card-p">Results Declared</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
