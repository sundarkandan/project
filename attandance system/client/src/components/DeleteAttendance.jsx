import axios from 'axios'
import { useEffect, useState } from 'react'
import { ToastContainer,toast } from 'react-toastify';
import { useNavigate,Link } from 'react-router-dom';

function DeleteAttendance(){
    const server="http://localhost:3000/";
    const [days,setDays]=useState([])
    const [present,setPresent]=useState([])
    const[student,setStudent]=useState([])
  const navigate=useNavigate()

useEffect(()=>{
    axios.get(server+'delattendance').then(res=>{
        if(res.data.msg=="fetched successfully"){
            setDays(res.data.getting1)
            toast.success(res.data.msg)
        }
        else{
            toast.error(res.data.msg)
        }
    })
},[])

async function deleting(idx,ele){
    console.log(idx,ele.today,ele.dept,ele.year)
    var a=confirm("are You sure to delete this "+ele.today+" of records");
    if(a){
        await axios.delete(server+'delattendance',{data:{today:ele.today,dept:ele.dept,year:ele.year}})
    }
    axios.get(server+'delattendance').then(res=>{
        if(res.data.msg=="fetched successfully"){
            setDays(res.data.getting1)
            console.log(res.data.getting1)
            toast.success(res.data.msg)
        }
        else{
            toast.error(res.data.msg)
        }
    })
}
    return(
        <> <div className=" navi mt-5 ms-5">
        <Link to='/' className="btn btn1">/Home</Link>
        <Link to='/staff' className="btn btn1">/Staff</Link>
      </div>
      <div className="container">
        <ToastContainer position='top-right' theme='colored'  autoClose={3000} />
        <div className="row mt-5">
            <div className="col"><center><h1>Delete the Attendance</h1></center></div>
        </div>
        <div className="row">
            <div className="col">
            <table className="table mt-5 table-hover">
                <thead className="custom-bg">
                   <tr>
                   <th>Day</th>
                    <th>Date</th>
                    <th>dept</th>
                    <th>Batch</th>
                   </tr>
                </thead>
                <tbody className="custom-bg">
                 {
                    days.map((ele,idx)=>{
                        return(
                            <tr key={idx} onClick={()=>deleting(idx,ele)}>
                            <td>{idx+1}</td>
                            <td>{ele.today}</td>
                            <td>{ele.dept}</td>
                            <td>{ele.year}</td>
                          </tr>
                        )
                    })
                 }
                </tbody>
            </table>
            </div>
        </div>
      </div></>
    )
}
export default DeleteAttendance