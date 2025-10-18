import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios'
function Booked(){
    var[username,setUsername]=useState('')
    var[userMail,setUsermail]=useState('')
    var[userMobile,setUsermobile]=useState('')
    const location=useLocation()
    const navigate=useNavigate()
    const[movie,setMovie]=useState([])
    const[user,setUser]=useState([])

    const server=import.meta.env.VITE_SERVER;
      useEffect(()=>{
                  const recived=location.state
            console.log(recived)
            const movies=recived.movie
            const user=recived.user;
            setUser(user)
            setMovie(movies)
             
            },[])

             function handleNavigation(){
              
                if(username && userMail && userMobile){
                    const updated={ ...user, username,userMail,userMobile }
                    setUser(updated);
                    axios.post(server+"booked",updated).then(res=>{
                        toast.success(res.data.msg)
                        navigate('/ticket-layout',{state:{ticketId:res.data.ticketId,movie,user:updated}})

                    })
                }
                else{
                   
                    toast.error('Please Fill the All Details')
                }
               }
    return(
        <div className="container cont100">
            <div className="row flex cont100">
                <div className="col-12 col-md-6">
                    <div className="boxed flex fcol gap-3">
                        <h1>Enter Your Details</h1>
                        <input type="text" className="form-control" onChange={(e)=>{setUsername(e.target.value)}} placeholder="Enter Your Name"/>
                        <input type="text" className="form-control" onChange={(e)=>{setUsermail(e.target.value)}} placeholder="Enter Your Email"/>
                        <input type="number" className="form-control" onChange={(e)=>{setUsermobile(e.target.value)}} placeholder="Enter Your Mobile No."/>
                        <div className="flex gap-5">
                            <button className="btn" onClick={handleNavigation}>Submit</button><button className="btn">Cancel</button>
                        </div>
                        
                        <center><p>Please provide accurate information. In case of technical issues, we may need to contact you regarding showtimes.</p></center>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Booked;