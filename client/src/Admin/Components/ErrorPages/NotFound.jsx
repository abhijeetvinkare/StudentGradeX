import React from 'react'
import {IoMdArrowRoundBack} from "react-icons/io"
import { useNavigate } from "react-router-dom";

function NotFound() {

  let history = useNavigate();
  
  return (
    <div className="eror-maindiv">
      <div className="error-heading-div">
        <h1 className="eror-heading">404</h1>
        <p className="error-para">
        The Page You Requested Was Not Found. Back To Previous Page...
        </p>
      </div>
      <button onClick={() => history(-1)} className="err-button" style={{ width: 150, fontSize:18}}><IoMdArrowRoundBack size={25}/>&#160;Go Back</button>
    </div>
  )
}

export default NotFound