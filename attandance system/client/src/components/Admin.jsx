import {Link} from "react-router-dom"
import { ToastContainer,toast } from "react-toastify";
import axios from "axios";
import { useLocation,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Img from "../images/illegal.png"
function Admin(){
  const server="http://localhost:3000";
  const location=useLocation()
  useEffect(()=>{
    console.log(location.state)
  },[])
    async function sending(){
      var a=confirm("Are You Sure to delete all the records of the Students")
      if(a){
        await axios.delete(server+"/deleterecords").then(res=>{
          if(res.data=="Metioned records are deleted successfully"){
            toast.success(res.data)
          }
          else{
            toast.error(res.data)
          }
          
        })
      }
    }
    return(
      <>
      <div className=" navi mt-5 ms-5">
        <Link to='/' className="btn btn1">/Home</Link>
    
      </div>
       {location.state!=null && location.state.auth?<div className="container flex f-col gap fh">
        <h1 className="display-3 mt-5">Admin Pannel</h1>
        
        <ToastContainer position='top-right' theme='colored'  autoClose={3000} />
           <Link to="/newstudent" className="btn flex btn2">New Student Registration</Link>
           <Link to="/alterStudent" className="btn flex btn2">Alter The Student Details</Link>
            <Link to="/addDepartment" className="btn flex btn2">Add Department</Link>
            <Link to="/addbatch" className="btn flex btn2">New Batch Registration</Link>
           <Link to="/alterattendance" className="btn flex btn2">Alter Student's Attendance</Link>
            <button onClick={sending} className="btn flex btn2">Delete the All student records</button>
            <Link to="/studentdeletes" className="btn flex btn2">Delete Students and Records</Link>
            <Link to="/deleteone" className="btn flex btn2">Delete One Student and Records</Link>
            <Link to="/passchange" className="btn flex btn2">Change The Admin Password</Link>
       </div>:<><center><h1 className="mt-5 display-1 text-danger">illegal authentication found</h1> <img src={Img} width='300px'/></center></>}
      </>
    )
}
export default Admin;