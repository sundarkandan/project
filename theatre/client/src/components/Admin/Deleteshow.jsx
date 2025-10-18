import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
function Deleteshow(){
    const server=import.meta.env.VITE_SERVER;
    const location=useLocation()
    const[movie,setMovie]=useState([])
    const[time,setTime]=useState([])
    const[movies,setMovies]=useState([])
    const[date,setDate]=useState([])
    useEffect(()=>{
        const getted=location.state
        setMovie(getted.showTime)
        setMovies(getted)
        console.log(getted.showTime)
        setTime(getted.showTime.map(ele=>ele.time))
        setDate(getted.showTime.map(ele=>ele.date))
        console.log()
    },[])
    async function DelShow(showdate,showtime){
        console.log(Array(movies,showdate,showtime))
        const datas=Array(movies,showdate,showtime)
        await axios.delete(server+'delshow',{data:datas}).then(res=>toast.success("Show time Removed Successfully"))
    }
    async function dateDelete(date) {
        console.log(date)
        await axios.post(server+'dateDelete',{date:Array(movies,date)}).then(res=>{
            toast.success(res.data)
        })
    }
    return(
        <div className="container">
            <div className="row">
                 <div className="col-12">
                    <center><h1 className="display-3">Avaliable Shows</h1></center>
                </div>
            </div>
            <div className="row">
                <div className="col cont80 flex">
                    <table className="adtable">
                        <thead>
                            <th className="th">Show Date</th>
                            <th className="th">Show Time</th>
                            <th className="th">Delete Date</th>
                        </thead>
                        <tbody>
                         {
                            movie.map(ele1=> <tr>
                            <td className="td">{ele1.date}</td>
                            <td className="th flex gap-2">{ele1.time.map(ele=><button onClick={()=>DelShow(ele1.date,ele)} className="btn">{ele}</button>)}</td>
                            <td className="td"><button className="btn" onClick={()=>dateDelete(ele1.date)}>Delete Date</button></td>
                          </tr>)
                         }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default Deleteshow;