import { useEffect,useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { useLocation,useNavigate } from "react-router-dom"
import axios from "axios"
function Parking(){
    var[disp,setDisp]=useState('block')
    const[slots,setSlots]=useState([])
    const server=import.meta.env.VITE_SERVER
    const location=useLocation()
    const[movie,setMovie]=useState([])
    const[user,setUser]=useState([])
    const[bookedSlots,setBookedSlots]=useState([])
    const navigate=useNavigate()
        useEffect(()=>{
              const recived=location.state
        console.log(recived)
        const movies=recived.movie
        const user=recived.user;
        setUser(user)
        setMovie(movies)
          axios.get(server+'book',{params:{time:user.time,date:user.date}}).then(res=>{
                  const allSlot = res.data.flatMap(ele => ele.parkingsolt);
                  console.log(allSlot)
                  setBookedSlots(allSlot)
                
          })
            window.addEventListener("scroll",()=>{ setDisp('none')});
        },[])
    const[letter,setLetter]=useState(['A','B','C','D'])
    const[number,setNumber]=useState([1,2,4,5,6,7,8,9,10])
    
    function handleNavigation(con){
    console.log('called')
    if(slots.length==0 && con){
        toast.error('Please Select the Seat First')
    }
    else{
        const updated={ ...user, parkingsolt: slots }
        setUser(updated);
        console.log(movie)
        navigate('/booked',{state:{movie,user:updated}})
    }
   }
    return(
       <>
      <div className="scroll fixed-bottom ms-5 mb-5 text-center" style={{display:disp}}><h4>Scroll To View <br /> v</h4></div>
       <div className="container conts cont100">
     
        <div className="row mt-5">
            <center><h1>Select the Parking Slot</h1></center>
            <center><p><b>Note:</b> All slots are designated for cars and bikes only.</p></center>
            <center><h2>Each Slot Price: ₹50</h2></center>
            <center><p>Maximum 3 slots Allowed for every user</p></center>
              <div className="info flex flex-column flex-md-row mt-4">
                   <div className="flex"><div className="seats"></div><h3 className="ms-1">Avaliable</h3></div>
                   <div className="flex"> <div className="seats bg-secondary border-secondary"></div> <h3  className="ms-2">Booked</h3></div>
                   <div className="flex"> <div className="seats bg"></div> <h3  className="ms-1">Selected</h3></div>
                </div>
        </div>

       {
        letter.map(ele=>{
            return(
                 <div className="row mt-5">
            <div className="col flex">
                {number.map(num=>{
                   if(bookedSlots.includes(ele+num)){
                     return(
                        <label htmlFor={ele+num}><div onClick={()=>{
                            
                        }} className={"parking flex booked "}>{ele+num}</div></label>
                    )
                   }
                   else{
                     return(
                        <label htmlFor={ele+num}><div onClick={()=>{
                            
                        }} className={"parking flex "+(slots.includes(ele+num)?"bg text-black":"")}>{ele+num}<input className={"d-none"}  id={ele+num}  onClick={(e)=>{
                            if(e.target.checked){
                                if(slots.length==3){
                                    toast.warn("Maximum 3 Slots Allowed for every user")
                                }
                                else{
                                    setSlots([...slots,ele+num])
                                }
                            }
                            else{
                                setSlots(slots.filter(sl=>sl!==ele+num))
                            }
                        }} type="checkbox" /></div></label>
                    )
                   }
                })}
                
            </div>
        </div>
            )
        })
       }
           
      
       </div>
       <div className="purchase-info flex  fixed-bottom">
        <center><div className="fixed-bottom mb-5">
                 <p className="d-inline screen-slog">This Way is Entrance</p>
               
               </div></center>
            <button onClick={()=>handleNavigation(false)} className="ms-2 btn">Proceed Without Parking Slot</button>
            <h1  className="ms-auto me-5">Prize:{slots.length*50}</h1>
            <button className="btn me-3" onClick={()=>handleNavigation(true)}>Conform Booking</button>
            
        </div>
        
       </>
    )
}
export default Parking