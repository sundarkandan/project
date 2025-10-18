import { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios'
function Book(){
    var[ele,setEle]=useState(['A','B','C','D','E','F','G','H','I','J','K','L'])
    var[seatno,setSeatno]=useState([1,2,3,4,5,6,7,8,9,10,11,12])
    var[selected,setSelected]=useState([])
    const[movie,setMovie]=useState([])
    const[user,setUser]=useState([])
    const location=useLocation()
    const navigate=useNavigate()
    const server=import.meta.env.VITE_SERVER

    const[BookedSeats,setBookedSeats]=useState([])
    useEffect(()=>{
        const recived=location.state
        const movies=recived.movie.tickets
        const user=recived.updatedUser;
        setUser(user)
        setMovie(movies)
        console.log(recived)
        axios.get(server+'book',{params:{time:user.time,date:user.date}}).then(res=>{
          const allSeats = res.data.flatMap(ele => ele.seats);
        setBookedSeats(allSeats)
           
        })
    },[])
   function onchangeHandler(condition,datas){
    console.log(condition)
    console.log(datas)
    if(condition){
        setSelected([...selected,datas])
    }
    else{
        setSelected(selected.filter(ele=>ele!==datas))
        
    }
   }
   function handleNavigation(){
    console.log('called')
    if(selected.length==0){
        toast.error('Please Select the Seat First')
    }
    else{
        const updated={ ...user, seats: selected }
        setUser(updated);
        navigate('/foods',{state:{movie,user:updated}})
    }
   }
    return(
       <>
        <div className="container-fluid mt-5 ">
        <div className="row flex">
          <center><h1>Scroll & Select Yours Seats</h1></center>
            <div className="col-12  col-xl-6 flex fcol">
            <div className="imgs w-50 imgs3 mt-4" style={{backgroundImage:`url(${movie.posterurl})`}}></div>
                <h1>Movie : {movie.movie}</h1>
                <h4 className="text-secondary">Date: {user.date}</h4>
                <h4 className="text-secondary">Time:{user.time}</h4>
                <h1>Prize:₹{movie.prize}</h1>
                <div className="info flex flex-column flex-md-row mt-4">
                   <div className="flex"><div className="seats"></div><h3 className="ms-1">Avaliable</h3></div>
                   <div className="flex"> <div className="seats bg-secondary border-secondary"></div> <h3  className="ms-2">Booked</h3></div>
                   <div className="flex"> <div className="seats bg"></div> <h3  className="ms-1">Selected</h3></div>
                </div>
                <div className="ticket-cont mt-5 fcol">    
                    {ele.map((eles,idx)=>{
                        return(
                            <div className="seat flex">
                        <h6 className="rowl">{ele[idx]}</h6>
                       {
                        seatno.map(ele2=>{
                            if(BookedSeats.includes(ele[idx]+ele2)){
                                return(
                                   
                                <label htmlFor={ele[idx]+ele2}><div className={"seats2 text-black flex bg-secondary border-secondary"}>{ele[idx]+ele2}</div></label>
                            
                                )
                            }
                            else{
                                return(
                                <label htmlFor={ele[idx]+ele2}><div className={"seats  flex "+(selected.includes(ele[idx]+ele2)?"selected text-black":"")}>{ele[idx]+ele2}<input style={{display:"none"}} onChange={(e)=>{
                                console.log(ele[idx]+ele2)
                                onchangeHandler(e.target.checked,ele[idx]+ele2)
                        }} id={ele[idx]+ele2} type="checkbox" /></div></label>
                            )
                            }
                        })
                       }
                      
                    </div> 
                        )
                    })}
                    
                    </div>
            </div>
                     <center><div className="">
                 <p className="d-inline screen-slog">This Way is Screen </p>
                <div className="screen"></div>
               </div></center>
        </div>
       
              
                <div className="purchase-info flex  fixed-bottom">
            <h1 className="ms-5">Seats:{selected.length}</h1>
            <h1 className="ms-auto me-5">Prize:₹{selected.length*movie.prize}</h1>
            <button  className="btn me-3" onClick={handleNavigation}>Next</button>
        </div>
        </div>
       </>
    )
}
export default Book;