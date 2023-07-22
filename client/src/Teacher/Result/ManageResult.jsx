import React, { useEffect } from 'react'
import Sidebar from '../Components/Siderbar'
import Navbar from '../../Admin/Components/Navbar'
import "./ManageResult.css"
import { useNavigate } from "react-router-dom";
import DataTable, { createTheme } from 'react-data-table-component'
import {MdOutlineDelete} from 'react-icons/md';
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from 'react';
import axios from 'axios';
import { CSVLink } from "react-csv";
import Button from 'react-bootstrap/Button';

function ManageResult() {

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [pending, setPending]= useState(false);

  const history = useNavigate();

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
      history("/error")
    }
  };

  useEffect(() => {
    
  const _token = sessionStorage.getItem("_token");

  if (_token) {
    user_authentication();
  }else{
    history("/teacher")
  }

  }, []);


  const getData = async() =>{
    setPending(true)
    try{
        const response = await axios.get('http://localhost:5000/user/api/get-result');
        setData(response.data)
        setFilteredData(response.data)
    }catch(error){
      console.log(error);
    }
    setPending(false)
  }


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

    const token = sessionStorage.getItem("_token");
    const config = {
      headers: {
        Authorization: token,
      },
    };

    try {
      await axios.delete(`/teacher/api/delete-result/${id}`, config);
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
  }

  useEffect(() => {
    getData()
   }, []);
 
   createTheme('solarized', {
     text: {
       primary: '#268bd2',
       secondary: '#2aa198',
     },
     background: {
       default: '#002b36',
     },
     context: {
       background: '#cb4b16',
       text: '#FFFFFF',
     },
     divider: {
       default: '#073642',
     },
     action: {
       button: 'rgba(0,0,0,.54)',
       hover: 'rgba(0,0,0,.08)',
       disabled: 'rgba(0,0,0,.12)',
     },
   }, 'dark');
 
   const columns = [
     {
       name: 'Sr.no',
       cell: (row, index) => index + 1
     },
     {
      name: "Class",
      selector : (row) => row.classs,
    },
     {
       name: "Semester",
       selector : (row) => row.semester,
     },
     {
      name: "Batch Year",
      selector : (row) => row.batchyear,
    },
     {
       name: "Student Name",
       selector : (row) => row.studentname,
     },
     {
       name: "Seat No.",
       selector : (row) => row.seatno,
     },
     {
       name: 'Delete',
       button: true,
       cell: (row) => <button className="btn btn-dark btn-sm" onClick={() => deletealert(row._id)}><MdOutlineDelete size={22}/></button>
     }
   ]


   const csvHeaders = [
    { label: "Sr.no", key: "Sr.no" },
    { label: "Student Name", key: "studentname" },
    { label: "Class", key: "classs" },
    { label: "Batch Year", key: "batchyear" },
    { label: "Semester", key: "semester" },
    { label: "Seat Number", key: "seatno" },
  ];

  // Modify data to include the "Sr.no" field
  const modifiedData = data.map((item, index) => ({
    ...item,
    "Sr.no": index + 1,
  }));

  useEffect(() => {
    const result = data.filter((data) => {
      return data.seatno.toLowerCase().match(search.toLowerCase());
    });
    setFilteredData(result);
  }, [search]);

  const ExpandedComponent = ({ data }) => {
    return (
      <div className="manage-sub-expanded-com-div">
        {/* Content of the expanded component */}
        <p>Student Name : {data.studentname}</p>
        <p>Class : {data.classs}</p>
        <p>Semester : {data.semester}</p>
        <p>Batch Year : {data.batchyear}</p>
        <p>Seat Number : {data.seatno}</p>
      </div>
    );
  };

  return (
    <div className='manage-result-main'>
    <Sidebar />
    <div className="manage-result-container">
      <Navbar />
      <div className="manage-result-div">
      <div>
            <DataTable 
              className="subject-table-div"
              title="RESULTS"
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
                  placeholder="Seat Number"
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
  )
}

export default ManageResult