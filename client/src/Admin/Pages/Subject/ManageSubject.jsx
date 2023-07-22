import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import "./ManageSubject.css";
import DataTable, { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSVLink } from "react-csv";
import Button from "react-bootstrap/Button";
// loading spinner
import Backdrop from "@mui/material/Backdrop";
import HashLoader from "react-spinners/HashLoader";

function ManageSubject() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState(false);
  const history = useNavigate();

    //page loading
    const [loading, setLoading] = useState(false);

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

  const getData = async () => {
    setPending(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/api/get-subject"
      );
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.log(error);
    }
    setPending(false);
  };

  function deletealert(id) {
    Swal.fire({
      background: "#1A1A1A",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  }

  const handleDelete = async (id) => {

    setLoading(true);

    try {
      const token = sessionStorage.getItem("_token");
      const config = {
        headers: {
          Authorization: token,
        },
      };

      await axios
        .delete(`/admin/api/delete-subject/${id}`, config);
       // If the request is successful, remove the deleted record from state
       toast.success("Success! 😎", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setData(data.filter(item => item._id !== id));
    } catch (error) {
      if (error) {
        // Authentication failed
        const { message } = error.response.data;
        // Display or handle the error message
        alert(message);
        history("/error");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  createTheme(
    "solarized",
    {
      text: {
        primary: "#268bd2",
        secondary: "#2aa198",
      },
      background: {
        default: "#002b36",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#073642",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.08)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "dark"
  );

  const columns = [
    {
      name: "Sr.no",
      cell: (row, index) => index + 1,
    },
    {
      name: "Semester",
      selector: (row) => row.semester,
      sortable: true,
    },
    {
      name: "Subject Name",
      selector: (row) => row.subject_name,
      sortable: true,
    },
    {
      name: "Subject Code",
      selector: (row) => row.subject_code,
      sortable: true,
    },
    {
      name: "Credits",
      selector: (row) => row.credits,
      sortable: true,
    },
    {
      name: "Delete",
      button: true,
      cell: (row) => (
        <button
          className="btn btn-dark btn-sm"
          onClick={() => deletealert(row._id)}
        >
          <MdOutlineDelete size={22} />
        </button>
      ),
    },
  ];

  const csvHeaders = [
    { label: "Sr.no", key: "Sr.no" },
    { label: "Semester", key: "semester" },
    { label: "Subject Name", key: "subject_name" },
    { label: "Subject Code", key: "subject_code" },
    { label: "Credits", key: "credits" },
  ];

  // Modify data to include the "Sr.no" field
  const modifiedData = data.map((item, index) => ({
    ...item,
    "Sr.no": index + 1,
  }));

  useEffect(() => {
    const result = data.filter((data) => {
      return data.subject_name.toLowerCase().match(search.toLowerCase());
    });
    setFilteredData(result);
  }, [search]);

  const ExpandedComponent = ({ data }) => {
    let subjectType = "";
    if (data.subject_type === "TH") {
      subjectType = "Theory";
    } else {
      subjectType = "Practical";
    }

    return (
      <div className="manage-sub-expanded-com-div">
        {/* Content of the expanded component */}
        <p>Semester : {data.semester}</p>
        <p>Subject Name : {data.subject_name}</p>
        <p>Subject Code : {data.subject_code}</p>
        <p>Subject Credits : {data.credits}</p>
        <p>Subject Type : {subjectType}</p>
        <p>Subject Min Marks : {data.min_marks}</p>
        <p>Subject Max Marks : {data.max_marks}</p>
      </div>
    );
  };

  return (
    <>
    <div className="manage-subject-main">
      <Sidebar />
      <div className="manage-subject-container">
        <Navbar />
        <div className="manage-subject-div">
          <div>
            <DataTable
              className="subject-table-div"
              title="SUBJECT LIST"
              columns={columns}
              data={filteredData}
              fixedHeader
              fixedHeaderScrollHeight="460px"
              highlightOnHover
              theme="solarized"
              subHeader
              subHeaderComponent={
                <div className="search-n-export-div">
                  <input
                    type="text"
                    className="search-input-table"
                    placeholder="Subject Name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button variant="dark">
                    <CSVLink
                      data={modifiedData}
                      headers={csvHeaders}
                      filename="subject_data.csv"
                      className="csvlink"
                    >
                      Export
                    </CSVLink>
                  </Button>
                </div>
              }
              expandableRows
              expandableRowsComponent={ExpandedComponent}
              progressPending={pending}
            />
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover={false}
              theme="dark"
            />
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
    </>
  );
}

export default ManageSubject;

// You can delete the records you created, but the ones predefined by a developer cannot be deleted, and only the developer can modify them.
