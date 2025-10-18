import { useEffect, useState } from "react"
import {Link} from "react-router-dom"
import axios from 'axios'
function Admin(){
  var[count,setCount]=useState(0)
  const server=import.meta.env.VITE_SERVER
  const[user,setUser]=useState([])
  const[slot,setSlot]=useState('')
  const[seat,setSeat]=useState('')
  const[snack,setSnack]=useState('')
  useEffect(()=>{
      axios.get(server+"admin").then(res=>{
        setUser(res.data)
        console.log(res.data)
        const users=res.data
        const slots=users.reduce((acc,cur)=>parseInt(acc+cur.parkingsolt.length),0)
        const seats=users.reduce((acc,cur)=>acc+cur.seats.length*cur.ticketPrize,0)
        const snacks=users.reduce((acc,cur)=>acc+cur.snacks.reduce((acc2,cur2)=>acc2+cur2.qty*cur2.prize,0),0)
        setSlot(slots*50)
        setSeat(seats)
        setSnack(snacks)
   
      })
  },[])
  return(
      <>
      <div className="container">
        <div className="row mt-5">
          <div className="col-12"><center><h1 className="display-3"><span className="text-white">Admin</span> Pannel</h1></center></div>
        </div>
        <div className="row mt-3">
          <div className="col-12 gap-5 flex">
            <div className="admin-boxes fcol flex">
              <p className="text-white">Booked Seats costs</p>
              <h1>₹ {seat}</h1>
            </div><div className="admin-boxes fcol flex">
              <p className="text-white">Booked Parking costs</p>
              <h1>₹ {slot}</h1>
            </div><div className="admin-boxes fcol flex">
              <p className="text-white">Orderd Foods costs</p>
              <h1>₹ {snack}</h1>
            </div><div className="admin-boxes fcol flex">
              <p className="text-white">Total Earnings</p>
              <h1>₹ {seat+slot+snack}</h1>
            </div>
            
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-12 flex gap-5">
            <Link to="/adup" className="admin-boxes-2 flex"><p className="text-white">Upcomming Movies</p></Link>
            <Link className="admin-boxes-2 flex" to="/avl"><div ><p className="text-white">Avaliable Shows</p></div></Link>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-12 flex gap-5">
            <Link to='/adtime' className="admin-boxes-2 flex">
              <h1>Time</h1>
            </Link>
             <Link to='/addate' className="admin-boxes-2 flex">
              <h1>Date</h1>
            </Link>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-12 flex gap-5">
            <Link to='/adBooked' className="admin-boxes-2 flex">
              <h1>Booked</h1>
            </Link>
             <Link to="/adfood" className="admin-boxes-2 flex"> 
              <h1>Foods</h1>
            </Link>
          </div>
        </div>
      </div>
      </>
    )
}
export default Admin