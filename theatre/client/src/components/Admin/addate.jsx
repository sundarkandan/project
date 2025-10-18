import { useEffect, useState } from "react";
import axios from "axios"
import {toast} from "react-toastify"
function Addate(){
    const server=import.meta.env.VITE_SERVER
    const [Days,setDays]=useState([])
    useEffect(()=>{
        axios.get(server+'addate').then(res=>{
            setDays(res.data)
            console.log(res.data)
        })
    },[])
    const [Date,setDate]=useState()
     async function deleting(date){
       const a=confirm(`Are You sure to delete this Date ${date}?`)
       if(a){
         await axios.delete(server+'addate',{data:{date}}).then(res=>{
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
        axios.get(server+"addate").then(res=>{
            setDays(res.data)
            
        })
    }
   async function sending(){
       if(Date){
        const processed=Date.split('-').reverse().join('/')
         await axios.post(server+'addate',{date:processed}).then(res=>{
            
            if(res.data.msg=="Show Date Added successfully"){
                toast.success(res.data.msg)
            }
            else if(res.data.msg=="This Date is already exist"){
                toast.warn(res.data.msg)
            }
            else{
                toast.error(res.data.msg)
            }
        })
       }
       else{
        toast.warn('Please Select a Date Value')
       }
          axios.get(server+'addate').then(res=>{
            setDays(res.data)
            console.log(res.data)
        })
   }
    return(
       <div className="container cont100">
            <div className="row mt-5">
                <center><div className="col"><h1 className="display-3">Show <span className="text-white">Dates</span></h1></div></center>
            </div>
            <div className="row mt-3">
                <div className="col-11">
                   <center> <input type="date" onChange={(e)=>setDate(e.target.value)} className="form-control" /></center>
                </div>
                <div className="col-1">
                    <center><input type="button" value="Add Date" onClick={sending} className="btn " /></center>
                </div>
                <div className="row gap-4 flex cont80">
                 {
                    Days&&Days.length==0?<center><h1 className="text-secondary">Please Add the Date</h1></center>:Days.map((ele,idx)=>{
                        return(
                            <div onClick={()=>deleting(ele.date)} className="time flex">
                               <h5 className="text-white">
                                {ele.date}
                               </h5>

                            </div>   
                        )
                    })
                 }  
                </div>
            </div>
       </div>
    )
}
export default Addate;