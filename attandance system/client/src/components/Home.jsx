import { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import StudentIcon from "../images/student.png"
import DaysIcon from "../images/days.png"
import axios from "axios";
import DeptIcon from "../images/dept.png"
import { ToastContainer,toast } from "react-toastify";
function Home(){
  const server="http://localhost:3000/";
  const[total,setTotal]=useState([])
  const[dept,setDept]=useState([])
  const[days,setDays]=useState([])
  var[con,setCon]=useState(false)
  var[nav,setNav]=useState({nav:"",con:false})
  var[pass,setPass]=useState('')
  const navigate=useNavigate()
  
  const ToadayDate=new Date().toISOString().split('T')[0];
  useEffect(()=>{
    axios.get(server+"alterStudent").then(res=>{
      setTotal(res.data.getting)
      setDays(res.data.getting2)
      console.log(res.data.getting)
    })
    axios.get(server+"newstudent").then(res=>{
      setDept(res.data.dept)
    })
  },[])
  async function checking(){
    console.log(nav.nav)
    if(nav.nav=='/admin'){
      await axios.post(server+'home',{pass}).then(res=>{
        console.log(res.data.result)
      if(res.data.result==true){
        navigate("/admin",{state:{auth:true}})
      }
      else{
        toast.error("Oops! Password is Wrong")
      }
    })
    }
    else if(nav.nav==="/staff"){
      console.log('condtion activated')
      navigate('/staff')
    }
    else{
      toast.error("Please select a User")
    }
  }
    return(
      <div className="container">
        <Link to="/missingattendance"><h4 className="date">Today Date:{ToadayDate}</h4></Link>
         <ToastContainer position="top-right" theme="colored" autoClose={3000} />
         
        <center><h1 className="display-4 mt-3">Merit College Attendance System</h1><h3>Merit Arts And Science Colleage-Idaikkal</h3> </center>
        <div className="row">
            <div className="col mt box clg">
                <div className="item flex f-col">
                  <img src={StudentIcon} width={"100px"} alt="" />
               <h6 className="bold" >Total Students:</h6>
                  <h1>{total.length}</h1>
                </div>
                <div className="item flex f-col">
                  <img src={DaysIcon} width={"100px"} alt="" />
               <h6 className="bold" >Total Days:</h6>
                  <h1>{days.length}</h1>
                </div>
                <div className="item flex f-col">
                  <img src={DeptIcon} width={"100px"} alt="" />
               <h6 className="bold" >Total Department:</h6>
                  <h1>{dept.length}</h1>
                </div>
              
               
            </div>
            <div className="col fh flex ">
              <div className="box flex gap f-col ms-5">
                <h1>Select User</h1>
                <select name="" className="form-control" onChange={(e)=>{setNav({...nav,nav:e.target.value});e.target.value=='/admin'?setCon(true):setCon(false)}}>
                  <option value="" className="cyan">select</option>
                  <option value="/admin" className="select">Admin</option>
                  <option value="/staff" className="select">staff</option>
                </select>
                {con?<input type="password" className="form-control" value={pass} onChange={e=>setPass(e.target.value)} id="" placeholder="Please Enter a Admin Password"/>:""}
                <button  onClick={()=>checking()} className="btn btn1">Enter</button>
              </div>
            </div>
        </div>
      </div>
    )    
}
export default Home;