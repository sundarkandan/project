import { useEffect, useState } from "react";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import { Link,useNavigate } from "react-router-dom";
function NewStudent(){
    const server="http://localhost:3000";
    const [batch,setBatch]=useState([])
    const [dept,setDept]=useState([])
  const navigate=useNavigate()

    useEffect(()=>{
        axios.get(server+"/newstudent").then(res=>{
           setBatch(res.data.batch)
           setDept(res.data.dept)
        })
    },[])
    var[student,setStudent]=useState({
        name:"",
        dob:"",
        rollno:0,
        gender:"",
        dept:"",
        batch:0
    })
    async function creating(){
        if(student.name && student.dob && student.rollno && student.gender && student.dept && student.batch){
            await axios.post(server+"/newstudentregister",student).then(res=>{
                if(res.data=='Student Registerd Successfully'){
                    toast.success(res.data)
                    setStudent({name:"",
                        dob:"",
                        rollno:0,
                        gender:"",
                        dept:"",
                        batch:0})
                }
                else{
                    toast.error(res.data)
                }
            })
        }
        else{
            console.log(student)
            toast.error("Please enter all fields")
        }
    }
        return(
            <>
         <div className=" navi mt-5 ms-5">
        <Link to='/' className="btn btn1">/Home</Link>
        <button onClick={()=>{navigate("/admin",{state:{auth:true}})}} className="btn btn1">/Admin</button>
      </div>
             <div className="container">
                <ToastContainer position="top-right" theme="colored" autoClose={3000}/>
                <div className="row ">
                    <div className="col-12 mt-5">
                       <center> <h1>Register New Student Student</h1></center>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 flex fh">
                        <div className="box2 f-col p-4 flex gap">
                          <center><h1>student Details</h1></center>
                            <div className="row">
                                <div className="col">
                                <label htmlFor="">Student Name:</label>
                                <input  onChange={(e)=>{setStudent({...student,name:e.target.value})}} value={student.name} type="text" className="form-control" />
                                </div>
                                <div className="col">
                                <label htmlFor="">Student Date of Birth:</label>
                                <input type="date" className="form-control" value={student.dob} onChange={(e)=>{setStudent({...student,dob:e.target.value})}}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                <label htmlFor="">Student Roll No:</label>
                                <input type="number" className="form-control" value={student.rollno} onChange={(e)=>{setStudent({...student,rollno:e.target.value})}}/>
                                </div>
                                <div className="col">
                                <label htmlFor="">Student Gender:</label>
                                <select type="text" className="form-control" value={student.gender} onChange={(e)=>{setStudent({...student,gender:e.target.value})}}>
                                    <option value="">click to select</option>
                                    <option value="Male" className="black">Male</option>
                                    <option value="Female" className="black">Female</option>
                                </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                <label htmlFor="">Student Department:</label>
                                <select type="text" className="form-control" value={student.dept} onChange={(e)=>{setStudent({...student,dept:e.target.value})}}>
                                    <option value="">click to select</option>
                                   {
                                        dept.map((ele,idx)=>{
                                            return(
                                                <option key={idx} value={ele.dept}>{ele.dept}</option>
                                            )
                                        })
                                   }
                                </select>
                                </div>
                                <div className="col">
                                <label htmlFor="">Student batch:</label>
                                <select type="text" className="form-control" value={student.batch} onChange={(e)=>{setStudent({...student,batch:e.target.value})}}>
                                <option value="">click to select</option>
                                    {
                                        batch.map((ele,idx)=>{
                                            
                                            return(
                                                <option key={idx} value={ele.batch}>{ele.batch}</option>
                                            )
                                        })
                                    }
                                </select>
                                </div>
                            </div>
                                <button className="btn btn2" onClick={creating}>Register</button>
                        <div>
                        </div>
                            </div>
                        </div>
                    </div>
                </div>
</>
           
        )
    
}
export default NewStudent;