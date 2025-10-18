import { useEffect, useState } from "react"
import axios from 'axios'
import {useNavigate} from "react-router-dom"
import { toast } from "react-toastify"
function AdBooked(){
    const server=import.meta.env.VITE_SERVER
    const navigate=useNavigate()
    const[users,setUsers]=useState([]);
    const[users2,setUsers2]=useState([])

    const[scrollDate,setScrollDate]=useState([])
    const[scrollTime,setScrollTime]=useState([])

    const[opt1,setOpt1]=useState('')
    const[opt2,setOpt2]=useState('')
    useEffect(()=>{
        axios.get(server+"admin").then(res=>{
            setUsers(res.data)
            setUsers2(res.data)
        })
        axios.get(server+'adbooked').then(res=>{
            setScrollDate(res.data.date)
            setScrollTime(res.data.time)
            console.log(res.data.date,res.data.time)
        })
    },[])

    function filtering(texts){
        if(texts){
            const datas=users.filter(ele=>ele.username.includes(texts)||ele._id.includes(texts)||ele.userMobile.includes(texts))
            setUsers(datas)
            
        }
        else{
            setUsers(users2)
        }
        
    }
    function Searching(){
        if(opt1&&opt2){
            const datas=users2.filter(ele=>ele.date==opt1&ele.time==opt2)
            console.log(datas)
            setUsers(datas)
        }
        else{
            toast.error("Please Select the Two Options Correctly")
            setUsers(users2)
        }
    }
    return(
        <>
        <div className="container">
            <div className="row">
                <div className="col"><center><h1 className="display-2">Booked <span className="text-white">Users</span></h1></center></div>
            </div>
            <div className="row">
                <div className="col-6 flex gap-2 mt-5">
                    <input type="text" className="form-control" onChange={(e)=>filtering(e.target.value)} placeholder="Search Customer using Name,Booking Id, phone No"/>
                </div>
                <div className="col-6 flex gap-2 mt-5">
                    <select name="" onChange={(e)=>setOpt1(e.target.value)} className="form-control" id="">
                        <option value="">Select the Date</option>
                        {
                            scrollDate.map(ele=>{
                                return <option value={ele.date}>{ele.date}</option>
                            })
                        }
                    </select>
                     <select name="" onChange={(e)=>setOpt2(e.target.value)} className="form-control" id="">
                        <option value="">Select the Time</option>
                        {
                            scrollTime.map(ele=>{
                                return <option value={ele.time}>{ele.time}</option>
                            })
                        }
                    </select>
                    <button className="btn" onClick={Searching}>Search</button>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col">
                    <table className="adtable">
                        <thead>
                            <th className="th">Booking Id</th>
                            <th className="th">Name</th>
                            <th className="th">phone Number</th>
                            <th className="th">Email</th>
                            <th className="th">Movie Name</th>
                            <th className="th">Seats</th>
                            <th className="th">Snack</th>
                            <th className="th">Parking Slots</th>
                            <th className="th">Total Charge</th>
                            <th className="th">action</th>
                        </thead>
                        <tbody>
                            {
                                users&&users.length==0?"":
                                users.map((ele,idx)=>{
                                    return(
                                        <tr>
                                <td  className="td">{ele._id}</td>
                            <td className="td">{ele.username}</td>
                            <td className="td">{ele.userMobile}</td>
                            <td className="td">{ele.userMail}</td>
                            <td className="td">{ele.movie}</td>
                            <td className="td">{ele.seats.join(', ')}</td>
                            <td className="td">{ele.snacks.map(ele=>ele.snack+" "+ele.qty).join(', ')}</td>
                            <td className="td">{ele.parkingsolt.join(', ')}</td>
                            <td className="td">₹{(ele.seats.length*ele.ticketPrize)+(ele.snacks.reduce((acc,cur)=>acc+parseInt(cur.prize*cur.qty),0))+ele.parkingsolt.length*50}</td>
                            <td onClick={()=>navigate('/ticket-layout',{state:ele})} className="td"><button className="btn">view</button></td>
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
export default AdBooked