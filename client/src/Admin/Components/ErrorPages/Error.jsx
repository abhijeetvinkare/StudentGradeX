import React from "react";
import "./Error.css";
import { useNavigate } from "react-router-dom";

function Error() {

  let history = useNavigate();

  return (
    <div className="eror-maindiv">
      <div className="error-heading-div">
        <h1 className="eror-heading">401</h1>
        <p className="error-para">
          Unauthorized Access. Authorization Failed! Login Agin...
        </p>
      </div>
      <button onClick={() => history("/admin")} class="err-button">Login</button>
    </div>
  );
}

export default Error;
