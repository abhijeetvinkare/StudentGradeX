import React, { useEffect, useState } from "react";
import "../../Admin/Components/Sidebar.css";
import { NavLink } from "react-router-dom";
import { CAccordionBody } from "@coreui/react";
import { CAccordion } from "@coreui/react";
import { CAccordionItem } from "@coreui/react";
import { CAccordionHeader } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import logo from "../../Admin/Components/srtmunlogo.png";
import { RxDashboard } from "react-icons/rx";
import { ImClipboard } from "react-icons/im";
import { RiLockPasswordFill } from "react-icons/ri";

function Sidebar() {
  const vars = {
    "--cui-accordion-border-width": "0px",
    "--cui-accordion-bg": "#1A1A1A",
  };


  const [pageName, setPageName] = useState('');

  useEffect(() => {
    const pathname = window.location.pathname;
    const pageName = pathname.substring(pathname.lastIndexOf('/') + 1);
    setPageName(pageName);
  }, []);


  let addCssClass;
  if (pageName === 'add-student') {
    addCssClass = true;
  } else{
    addCssClass = false
  }


  return (
    <div className={`sidebar-container ${addCssClass === true ? "active" : ""}`}>
      <div className="sidebar-heading-div">
        <NavLink to="/teacher-dashboard">
          <div className="logo-div"><img className="logo-sidebar" src={logo} alt="" /></div>
        </NavLink>
      </div>
      <div className="sidebar-span-div-main"><span className="sidebar-span">Main</span></div>
      <div className="dashbordb-btn-div">
        <NavLink to="/teacher-dashboard">
          <button className="dashboard-btn">
            <RxDashboard size={25} />
            &#160; Dashboard
          </button>
        </NavLink>
      </div>
      <div className="sidebar-span-div-extra"><span className="sidebar-span">Apperence</span></div>
      <CAccordion style={vars}>
        <CAccordionItem itemKey={1} className="accordion-item-div">
          <CAccordionHeader className="accordion-heading">
            <ImClipboard size={25} /> &#160; Result
          </CAccordionHeader>
          <CAccordionBody className="accordion-sub-menu">
            <NavLink to="/add-result">
              <button className="accordion-sub-menu-btn">Add Result</button>
            </NavLink>
            <NavLink to="/manage-result">
              <button className="accordion-sub-menu-btn">Manage Result</button>
            </NavLink>
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>
      <div id="sidebar-change-pass-div" className="sidebar-change-pass-div">
        <span className="sidebar-span-extra">More</span>
        <NavLink to="/teacher-change-pass"><button id="admin-change-pass-btn" className="admin-change-pass-btn"><RiLockPasswordFill size={25}/>&#160;Change Password</button></NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
