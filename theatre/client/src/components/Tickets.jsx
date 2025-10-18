import { Link } from "react-router-dom";
import axios from 'axios'
import { useEffect } from "react";
import { useState } from "react";
function Tickets(){
    const server=import.meta.env.VITE_SERVER
    const [tickets,setTickets]=useState([])
    useEffect(()=>{
        axios.get(server+'ticket').then(res=>{
            setTickets(res.data)
            console.log(res.data)
        })
    },[])
    return(
        <>
        <div className="container mt-5 cont80 ">
            <div className="row">
                <center><h1 className="display-4" data-aos="fade-up">Avaliable Shows</h1></center>
            </div>
            <div className="row mt-5">
                <div className="col-12 cont flex">
                    {
                        tickets&&tickets.length==0?<center><h1 className="text-secondary">Currently No Shows Running in our theatre</h1></center>:
                        tickets.map((ele,idx)=>{
                          return(
                              <div data-aos="zoom-out" className="cards fcol flex">
                        <div className="imgs imgs2"style={{backgroundImage:`url(${ele.posterurl})`}}></div>
                        <h6 className="text-white">{ele.movie}</h6>
                        <h6 className="text-secondary">{ele.certificate}</h6>
                        <Link to="/date" state={{tickets:ele}}><button className="btn">Book Now</button></Link>
                        </div> 
                          )
                        })
                    } 
                </div>
            </div>
        </div>
        </>
    )
}
export default Tickets;