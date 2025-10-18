import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer,toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function AlterStudent(){
    const server="http://localhost:3000/";
    const[Student,setStudent]=useState([]);
     const [dept,setDept]=useState([])
     const [batch,setBatch]=useState([])
     var[disp,setDisp]=useState(false)
     var[Updateing,setUpdating]=useState();
  const navigate=useNavigate()

        useEffect(()=>{
            axios.get(server+"newstudent").then(res=>{
               setBatch(res.data.batch)
               setDept(res.data.dept)
            })
        },[])
    var [index,setIndex]=useState(0)
    
    useEffect( ()=>{
        axios.get(server+'alterStudent').then(res=>{
            setStudent(res.data.getting)
        })
    },[])
    function finding(data){
        var valu=Student.filter(ele => ele.rollno.toString().includes(data)||ele.name.toString().includes(data)) ;
        setStudent(valu)
        if(!data){
            axios.get(server+'alterStudent').then(res=>{
                setStudent(res.data.getting)
            })
        }
    }
    async function send(){
        await axios.put(server+`alterStudent/${Updateing._id}`,Updateing).then(res=>{  
            if(res.data=='Roll No already exist'){
                toast.warn(res.data)
                setDisp(true);
            }
            else{
                toast.success(res.data)
                setDisp(false)
            }
            
        })
        await axios.get(server+'alterStudent').then(res=>{
            setStudent(res.data.getting)
        })
        
    }
    return(
        <>
         <div className=" navi mt-2 ms-5">
        <Link to='/' className="btn btn1">/Home</Link>
        <button onClick={()=>{navigate("/admin",{state:{auth:true}})}} className="btn btn1">/Admin</button>
      </div>
        <div className="container">
            <ToastContainer position="top-right" autoClose={3000} theme="colored"/>
            <div className="row mt-5">
                <div className="col-12">
                   <center><h1>Alter the Student Details</h1></center>
                </div>
            </div>
            <div className="row">
                <div className="col-12 flex"><input onChange={(e)=>finding(e.target.value)} type="text" className="form-control" placeholder="Enter the Student Roll Number to Search"/></div>
            </div>
            <div className="row mt-5 mb-5">
            <div className="col">
               {
                !disp? <table className="table table-hover">
                <thead className="custom-bg">
                   <tr>
                   <th>Roll Number</th>
                    <th>Student name</th>
                    <th>gender</th>
                    <th>Date of Birth</th>
                    <th>dept</th>
                    <th>Year</th>
                   </tr>
                </thead>
                <tbody className="custom-bg">
                    {
                        Student.map((ele,idx)=>{
                            return(
                                <tr key={idx} onClick={()=>{setUpdating(Student[idx]);setDisp(true)}}>
                        <td>{ele.rollno}</td>
                        <td>{ele.name}</td>
                        <td>{ele.gender}</td>
                        <td>{ele.dob}</td>
                        <td>{ele.dept}</td>
                        <td>{ele.batch}</td>
                    </tr>
                            )
                        })
                    }
                </tbody>
            </table>:""
               }
            </div>
        </div>
            {disp?
            <div className="row">
            <div className="col-12 flex fh">
                <div className="box2 p-absol f-col p-4 flex gap">
                  <center><h1>student Details</h1></center>
                    <div className="row">
                        <div className="col">
                        <label htmlFor="">Student Name:</label>
                        <input type="text" value={Updateing.name} onChange={(e)=>{setUpdating({...Updateing,name:e.target.value})}} className="form-control" />
                        </div>
                        <div className="col">
                        <label htmlFor="">Student Date of Birth:</label>
                        <input type="date"value={Updateing.dob} onChange={(e)=>{setUpdating({...Updateing,dob:e.target.value})}}  className="form-control" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                        <label htmlFor="">Student Roll No:</label>
                        <input type="number"value={Updateing.rollno} onChange={(e)=>{setUpdating({...Updateing,rollno:e.target.value})}} className="form-control" />
                        </div>
                        <div className="col">
                        <label htmlFor="">Student Gender:</label>
                        <select type="text"value={Updateing.gender} onChange={(e)=>{setUpdating({...Updateing,gender:e.target.value})}}  className="form-control" >
                            <option value="">select your gender</option>
                            <option value="boy">boy</option>
                            <option value="girl">girl</option>
                        </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                        <label htmlFor="">Student Department:</label>
                        <select type="text" value={Updateing.dept} onChange={(e)=>{setUpdating({...Updateing,dept:e.target.value})}} className="form-control">
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
                         <select type="text" value={Updateing.batch} onChange={(e)=>{setUpdating({...Updateing,batch:e.target.value})}} className="form-control">
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
                        <button className="btn btn2" onClick={send}>Update</button><button className="btn btn2" onClick={()=>setDisp(false)}>cancel</button>
                <div>
                </div>
                    </div>
                </div>
            </div>:""}
            </div>
            </>
    )
}
export default AlterStudent;