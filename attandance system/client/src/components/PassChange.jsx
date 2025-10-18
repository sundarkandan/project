import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate,Link } from "react-router-dom"

function PassChange(){
    var[current,setCurrent]=useState('');
    var[newp,setNew]=useState('');
    const server="http://localhost:3000";
  const navigate=useNavigate()

    async function sending(){
        axios.post(server+"/passchange",{current,newp}).then(res=>{
            toast.success(res.data.msg)
        })
    }
    return(
        <>
         <div className=" navi mt-5 ms-5">
        <Link to='/' className="btn btn1">/Home</Link>
        <button onClick={()=>{navigate("/admin",{state:{auth:true}})}} className="btn btn1">/Admin</button>
      </div>
           <div className="container">
          <ToastContainer position="top-right" autoClose={3000} theme="colored"/>
        <div className="row">
            <div className="col fh flex ">
              <div className="box flex gap f-col ms-5">
                <h2>Change Admin Password</h2>
                <label htmlFor="">Enter Your Current Password:</label>
                <input type="text" value={current} onChange={e=>setCurrent(e.target.value)} className="form-control" placeholder="current password"  />
                <label htmlFor="">Enter Your New Password</label>
                <input type="text" value={newp} onChange={e=>setNew(e.target.value)} className="form-control" placeholder="New password"  />       
                <button className="btn btn1" onClick={sending}>Click to Change</button>
              </div>
            </div>
        </div>
      </div>
        </>
    )
}
export default PassChange;