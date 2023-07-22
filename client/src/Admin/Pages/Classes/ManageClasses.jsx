import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import "./ManageClasses.css";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
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

function ManageClasses() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState(false);

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
        "http://localhost:5000/admin/api/get-classes"
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
        .delete(`/admin/api/delete-class/${id}`, config);
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
      name: "Class Name",
      selector: (row) => row.newclass,
      sortable: true,
    },
    {
      name: "Batch Year",
      selector: (row) => row.year,
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
    { label: "Class Name", key: "newclass" },
    { label: "Batch Year", key: "year" },
  ];

  // Modify data to include the "Sr.no" field
  const modifiedData = data.map((item, index) => ({
    ...item,
    "Sr.no": index + 1,
  }));

  useEffect(() => {
    const result = data.filter((data) => {
      return data.year.match(search);
    });
    setFilteredData(result);
  }, [search]);

  return (
    <>
      <div className="manage-classes-main">
        <Sidebar />
        <div className="manage-classes-container">
          <Navbar />
          <div className="manage-classes-div">
            <div>
              <DataTable
                className="subject-table-div"
                title="CLASSES LIST"
                columns={columns}
                data={filteredData}
                fixedHeader
                fixedHeaderScrollHeight="460px"
                highlightOnHover
                theme="solarized"
                progressPending={pending}
                subHeader
                subHeaderComponent={
                  <div className="search-n-export-div">
                    <input
                      type="text"
                      className="search-input-table"
                      placeholder="Batch Year"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button variant="dark">
                      <CSVLink
                        data={modifiedData}
                        headers={csvHeaders}
                        filename="result_data.csv"
                        className="csvlink"
                      >
                        Export
                      </CSVLink>
                    </Button>
                  </div>
                }
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

export default ManageClasses;
