import { useEffect, useState } from "react";
import axios from "axios"
import {toast} from "react-toastify"
function Adtime(){
    const server=import.meta.env.VITE_SERVER
    const[Times,setTimes]=useState([])
    useEffect(()=>{
        axios.get(server+"adtime").then(res=>{
            setTimes(res.data)
         
        })
    },[])
    const [time,setTime]=useState('')
    async function deleting(time){
       const a=confirm("Are You sure to delete this time?")
       if(a){
         await axios.delete(server+'adtime',{data:{time}}).then(res=>{
            if(res.status==201){
                toast.success(res.data)
            }
            else{
                toast.success(res.data)
            }
        })
       }
       else{
        toast.warn("Deletion Cancelled")
       }
        axios.get(server+"adtime").then(res=>{
            setTimes(res.data)
            
        })
    }
    async function sending(){
        const [h, m] = time.split(":"); 
        var hours = parseInt(h, 10);
        const minutes = m;
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        var converted_time=`${hours}:${minutes} ${ampm}`
       
       if(time){
        if(Times.length<10){
             await axios.post(server+"adtime",{time:converted_time}).then((res)=>{
          
            if(res.data.msg=="Show time Added successfully"){
                toast.success(res.data.msg)
            }
            else if(res.data.msg=="This time is already exist"){
                toast.warn(res.data.msg)
            }
            else{
                toast.error(res.data.msg)
            }
        })
        }
        else{
            toast.warn("You reach the Maximum limit of Shows times")
        }
       }
       else{
        toast.error("Please select a Time")
       }
         axios.get(server+"adtime").then(res=>{
            setTimes(res.data)
            
        })
    }
    return(
       <div className="container cont100">
            <div className="row mt-5">
                <center><div className="col"><h1 className="display-3">Show <span className="text-white">Times</span></h1></div></center>
            </div>
            <div className="row mt-3">
                <div className="col-11">
                   <center> <input type="time"onChange={(e)=>setTime(e.target.value)} className="form-control" /></center>
                </div>
                <div className="col-1">
                    <center><input type="button" onClick={sending} value="Add Time" className="btn " /></center>
                </div>
                <div className="row gap-4 flex cont80">
                    {
                        Times.length==0?<center><h1 className="text-secondary">Please Add the Times</h1></center>:Times.map((ele,idx)=>{
                            return(
                                 <div className="time flex" onClick={()=>deleting(ele.time)} key={idx}>
                                    <h5 className="text-white">{ele.time}</h5>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
       </div>
    )
}
export default Adtime;