import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function AddDepartment(){
  var[dept,setDept]=useState()
  const server="http://localhost:3000";
  const navigate=useNavigate()

  async function addDept(){
    if(dept){
      await axios.post(server+"/addDepartment",{dept}).then(res=>{
        if(res.data=="Department registered successfully"){
          toast.success(res.data);
        }
        else{
          toast.warn(res.data);
        }
        
      })
    }
    else{
      toast.error('Please enter a department on text field ')
    }
  }
    return(
      <> <div className=" navi mt-5 ms-5">
        <Link to='/' className="btn btn1">/Home</Link>
        <button onClick={()=>{navigate("/admin",{state:{auth:true}})}} className="btn btn1">/Admin</button>
      </div>
        <div className="container">
          <ToastContainer position="top-right" autoClose={3000} theme="colored"/>
        <div className="row">
            <div className="col fh flex ">
              <div className="box flex gap f-col ms-5">
                
                <h2>Add Your Department</h2>
                <input type="text" onChange={(e)=>{setDept(e.target.value)}} className="form-control" placeholder="New Department name" />
                <Link><button className="btn btn1"  onClick={addDept}>Add</button></Link>
              </div>
            </div>
        </div>
      </div>
      </>
    )
}
export default AddDepartment;