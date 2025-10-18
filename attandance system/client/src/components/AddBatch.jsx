import { useState } from "react";
import { Link} from "react-router-dom";
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function AddBatch(){
  var[batch,setBatch]=useState()
  const server="http://localhost:3000";
  const navigate=useNavigate()

  async function adding(){
    
   if(batch){
    await axios.post(server+"/addbatch",{batch}).then(res=>{
      if(res.data=="new batch registered successfully"){
        toast.success(res.data);
      }
      else{
        toast.warn(res.data)
      }
    })
   }
   else{
    toast.warn("please enter a valid batch year")
   }
  }
    return(
        <>
         <div className=" navi mt-5 ms-5">
                <Link to='/' className="btn btn1">/Home</Link>
                <button onClick={()=>{navigate("/admin",{state:{auth:true}})}} className="btn btn1">/Admin</button>
              </div>
        <div className="container">
           <ToastContainer position="top-right" autoClose={3000} theme="colored"/>
        <div className="row ">
            <div className="col fh flex ">
              <div className="box flex gap f-col ms-5">
                <h2>New Batch Registraion</h2>
                
                <input type="text" onChange={(e)=>setBatch(e.target.value)} className="form-control" placeholder="Batch year like this format '2023'" />
                <Link><button className="btn btn1"  onClick={adding}>Add</button></Link>
              </div>
            </div>
        </div>
      </div>
      </>
    )
}
export default AddBatch;