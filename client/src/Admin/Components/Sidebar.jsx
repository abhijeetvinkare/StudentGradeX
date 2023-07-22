import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { CAccordionBody } from "@coreui/react";
import { CAccordion } from "@coreui/react";
import { CAccordionItem } from "@coreui/react";
import { CAccordionHeader } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import logo from "./srtmunlogo.png";
import { RxDashboard } from "react-icons/rx";
import { RiLockPasswordFill } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";
import { BsPencilSquare, BsFillPeopleFill } from "react-icons/bs";

function Sidebar() {
  const vars = {
    "--cui-accordion-border-width": "0px",
    "--cui-accordion-bg": "#1A1A1A",
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-heading-div">
        <NavLink to="/dashboard">
          <div className="logo-div">
            <img className="logo-sidebar" src={logo} alt="" />
          </div>
        </NavLink>
      </div>
      <div className="sidebar-span-div-main">
        <span className="sidebar-span">Main</span>
      </div>
      <div className="dashbordb-btn-div">
        <NavLink to="/dashboard">
          <button className="dashboard-btn">
            <RxDashboard size={25} />
            &#160; Dashboard{" "}
          </button>
        </NavLink>
      </div>
      <div className="sidebar-span-div-extra">
        <span className="sidebar-span">Apperence</span>
      </div>
      <CAccordion style={vars}>
        <CAccordionItem itemKey={1} className="accordion-item-div">
          <CAccordionHeader className="accordion-heading">
            <SiGoogleclassroom size={25} /> &#160; Classes
          </CAccordionHeader>
          <CAccordionBody className="accordion-sub-menu">
            <NavLink to="/create-classes">
              <button className="accordion-sub-menu-btn">Create Class</button>
            </NavLink>
            <NavLink to="/manage-classes">
              <button className="accordion-sub-menu-btn">Manage Class</button>
            </NavLink>
          </CAccordionBody>
        </CAccordionItem>
        <CAccordionItem itemKey={2} className="accordion-item-div">
          <CAccordionHeader className="accordion-heading">
            <BsPencilSquare size={25} /> &#160; Subject
          </CAccordionHeader>
          <CAccordionBody className="accordion-sub-menu">
            <NavLink to="/create-subject">
              <button className="accordion-sub-menu-btn">Create Subject</button>
            </NavLink>
            <NavLink to="/manage-subject">
              {" "}
              <button className="accordion-sub-menu-btn">Manage Subject</button>
            </NavLink>
          </CAccordionBody>
        </CAccordionItem>
        <CAccordionItem itemKey={3} className="accordion-item-div">
          <CAccordionHeader className="accordion-heading">
            <BsFillPeopleFill size={25} /> &#160; Student
          </CAccordionHeader>
          <CAccordionBody className="accordion-sub-menu">
            <NavLink to="/add-student">
              <button className="accordion-sub-menu-btn">Add Student</button>
            </NavLink>
            <NavLink to="/manage-student">
              {" "}
              <button className="accordion-sub-menu-btn">Manage Student</button>
            </NavLink>
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>

      {/* just remove id="sidebar-change-pass-div and id="admin-change-pass-div for reomving bottom postion of btn" */}
      <div className="sidebar-change-pass-div">
        <span className="sidebar-span-extra">More</span>
        <NavLink to="/admin-change-pass">
          <button className="admin-change-pass-btn">
            <RiLockPasswordFill size={24} />
            &#160;Change Password
          </button>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
