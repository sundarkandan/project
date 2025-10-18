import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer,toast } from "react-toastify";
import { useNavigate } from "react-router-dom"

function DeleteOne(){
    const[Student,setStudent]=useState([]);
     const [dept,setDept]=useState([])
     const [batch,setBatch]=useState([])
       const navigate=useNavigate()
     
        useEffect(()=>{
            axios.get(server+"newstudent").then(res=>{
               setBatch(res.data.batch)
               setDept(res.data.dept)
            })
        },[])

    const server="http://localhost:3000/";
    useEffect( ()=>{
        axios.get(server+'alterStudent').then(res=>{
            setStudent(res.data.getting)
        })
    },[])
    function finding(data){
        var valu=Student.filter(ele => ele.rollno.toString().includes(data));
        setStudent(valu)
        if(!data){
            axios.get(server+'alterStudent').then(res=>{
                setStudent(res.data.getting)
            })
        }
    }
    async function send(index){
        const user=Student[index]
        var a=confirm('Are You to Delete '+Student[index].name+' details and records')
        if(a){
            axios.delete(server+'deleteone',{data:user}).then(res=>{
                if(res.data=='Metioned records are deleted successfully'){

                    toast.success(res.data)
                }
                else{
                    toast.error(res.data)
                }
            })
            axios.get(server+'alterStudent').then(res=>{
                setStudent(res.data.getting)
            })
        }
        axios.get(server+'alterStudent').then(res=>{
            setStudent(res.data.getting)
        })
        console.log(a)
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
                   <center><h1>Delete The One Student</h1></center>
                </div>
            </div>
            <div className="row">
                <div className="col-12 flex"><input onChange={(e)=>finding(e.target.value)} type="number" className="form-control" placeholder="Enter the Student Roll Number to Search"/></div>
            </div>
            <div className="row mt-5 mb-5">
            <div className="col">
              <table className="table table-hover">
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
                    <tr key={idx} onClick={()=>{send(idx)}}>
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
            </table>    
               
            </div>
        </div>
            </div>
            </>
    )
}
export default DeleteOne;