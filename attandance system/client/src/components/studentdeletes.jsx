import { ToastContainer,toast } from "react-toastify"
import axios from "axios"
import { useState,useEffect } from "react"
import { useNavigate,Link } from "react-router-dom";
function studentdeletes(){
  const server="http://localhost:3000";
    const[batch,setBatch]=useState([])
    const[dept,setDept]=useState([])
    const[student,setStudent]=useState({})
    const navigate=useNavigate()
    useEffect(()=>{
        axios.get(server+"/newstudent").then(res=>{
           setBatch(res.data.batch)
           setDept(res.data.dept)
           toast.success("fetched successfully")
        })
    },[])
    async function sending(){
      if(student.batch && student.dept){
        console.log(student)
        await axios.delete(server+"/studentdeletes",{data:student}).then((res)=>{
          if(res.data){
            toast.success("Metioned records are deleted successfully")
          }
          else{
            toast.error(res.data)
          }
        }
         
        )
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
        <div className="row">
            <div className="col fh flex ">
              <div className="box flex gap f-col ms-5">
                <h2>Delete Students Records</h2>
                <label htmlFor="">Student Department:</label>
                <select type="text" className="form-control" onChange={(e)=>{setStudent({...student,dept:e.target.value})}}>
                                    <option value="">click to select</option>
                                   {
                                        dept.map((ele,idx)=>{
                                            return(
                                                <option key={idx} value={ele.dept}>{ele.dept}</option>
                                            )
                                        })
                                   }
                                </select>
                                <label htmlFor="">Student batch:</label>
                                <select type="text" className="form-control" onChange={(e)=>{setStudent({...student,batch:Number(e.target.value)})}}>
                                <option value="">click to select</option>
                                    {
                                        batch.map((ele,idx)=>{
                                            
                                            return(
                                                <option key={idx} value={ele.batch}>{ele.batch}</option>
                                            )
                                        })
                                    }
                                </select>
              <button className="btn btn1" onClick={sending}>Click to Delete</button>
              </div>
            </div>
        </div>
      </div>
      </>
    )
}
export default studentdeletes