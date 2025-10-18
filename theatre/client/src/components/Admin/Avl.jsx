import {Link} from "react-router-dom"
import { useEffect, useState } from "react";
import axios from 'axios'
import {toast} from "react-toastify"
import { useNavigate } from "react-router-dom";
function Avl(){
      var [display, setDisplay] = useState(["none", "block"]);
      const server=import.meta.env.VITE_SERVER
      const navigate=useNavigate()
      const [Date1,setDate]=useState([])
      const[movies,setMovies]=useState([])
      const [Time,setTime]=useState([])
      const[Poster,setPoster]=useState('')
      const[movie,setMovie]=useState('')
      const[prize,setPrize]=useState('')
      const[Dates,setDates]=useState([])
      const[Times,setTimes]=useState([])
      const[Certificate,SetCertificate]=useState('')
      async function sending(){
        console.log(typeof prize)
        if(Poster=='' || movie=="" || Dates.length==0 || Times.length==0 || Certificate=="" || prize=='' || prize<=0){
          toast.error("Please Enter the All Fields ")
          return ;
        }
        const forms=new FormData()
        const datas = Dates.map(ele => ({
                    date: ele,
                    time: Times
                  }));
        forms.append('url',Date.now())
        forms.append('poster',Poster)
        forms.append('movie',movie)
        forms.append('prize',prize)
        forms.append('showTimes',JSON.stringify(datas))
        forms.append('certificate',Certificate)  
        await axios.post(server+'avl',forms).then(res=>{
          if(res.data=="Uploaded successfully"){
            toast.success(res.data)
          }
          else{    
            toast.error(res.data)
          }
        })
         await axios.get(server+'avl').then(res=>{
          setTime(res.data.Times)
        })
        await axios.get(server+'avl').then(res=>{
          setMovies(res.data.Movie)
        })
         setPoster('')
        setMovie('')
        SetCertificate('')
        setDates([])
        setTimes([])
      }
      useEffect(()=>{
        axios.get(server+'avl').then(res=>{
          setDate(res.data.dates)
          setTime(res.data.Times)
          setMovies(res.data.Movie)
        })
      },[])
      async function deleting(movieName){
        console.log(movieName)
        await axios.delete(server+'avl',{data:movieName}).then(res=>{
          toast.success(res.data)
        })
        await axios.get(server+'avl').then(res=>{
          setMovies(res.data.Movie)
          setTime(res.data.Times)
        })
        setPoster('')
        setMovie('')
        SetCertificate('')
        setDates([])
        setTimes([])
      }
    return(
        <>

        <div onClick={() => {
                      setDisplay((prev) => {
                        const newDisplay = [...prev];
                        newDisplay[0] = "block";
                        newDisplay[1]="none"
                        return newDisplay;
                      });
                    }} className="add flex">+</div>
    <div style={{display:display[0]}} className="container mt-5 flex cont100">
       <div className="boxesAdup container ">
        <div className="row flex">
            <div className="col-8">
             <center><h1>Enter the Details</h1></center>
            </div>
          </div>
          
          <div className="row flex">
            <div className="col-8">
              <label htmlFor="" className="form-label">Please select a portrait Poster</label>
              <input type="file" onChange={(e)=>{setPoster(e.target.files[0])}} className="form-control form2 w-100" />
            </div>
          </div>
          <div className="row flex">
            <div className="col-8">
              <label htmlFor="" className="form-label">Movie Name</label>
              <input type="text" onChange={e=>{setMovie(e.target.value)}} className="form-control form2 w-100" />
            </div>
          </div>
          <div className="row flex">
            <div className="col-8">
              <label htmlFor="" className="form-label">Show Prize</label>
              <input type="number" onChange={e=>{setPrize(parseInt(e.target.value))}} className="form-control form2 w-100" />
            </div>
          </div>
          <div className="row flex">
            <div className="col-8">
              <label htmlFor="" className="form-label">Movie Show Time</label>
              <div className="check flex">
             {Time && Time.length!=0? Time.map((ele,idx)=>{
              return(
                <div>  
              <input className="form-check-input" type="checkbox" onChange={
                (e)=>{
                  var value=e.target.value
                  var checked=e.target.checked
                  if(checked){
                    setTimes((prev)=>[...prev,value])
                  }
                  else{
                    setTimes((prev)=>prev.filter(ele=>ele!==value))
                  }
                }
              } value={ele.time} id={"time"+idx+1}/>
              <label className="form-check-label" htmlFor={"time"+idx+1}>{ele.time}</label>

              </div>
              )
             }):<center><h6 className="text-secondary">No Avaliable Times found Please Add the time into Time Section</h6></center>}
              
              </div>
            </div>
             <div className="col-8">
              <label htmlFor="" className="form-label">Movie Show Date</label>
              <div className="check flex">
             {Date1 && Date1.length!=0? Date1.map((ele,idx)=>{
              return(
                <div>  
              <input className="form-check-input"  onChange={
                (e)=>{
                  var value=e.target.value
                  var checked=e.target.checked
                  if(checked){
                    setDates((prev)=>[...prev,value])
                  }
                  else{
                    setDates((prev)=>prev.filter(ele=>ele!==value))
                  }
                }
              } type="checkbox" value={ele.date} id={"date"+idx+1} />
              <label className="form-check-label" htmlFor={"date"+idx+1}>{ele.date}</label>

              </div>
              )
             }):<center><h6 className="text-secondary">No Avaliable Dates found Please Add the time into Time Section</h6></center>}
              
              
              </div>
            </div>
          </div>
          <div className="row flex ">
            <div className="col-8">
              <label htmlFor="" className="form-label">Movie Certificate</label>
              <select type="date" onChange={(e)=>{SetCertificate(e.target.value)}} className="form-control form2 w-100" >
                <option value="">Please Select the Certificate</option>
                <option value="U – Universal">U – Universal</option>
                <option value="UA – Parental Guidance (12+)">UA – Parental Guidance (12+)</option>
                <option value="A – Adults Only (18+)">A – Adults Only (18+)</option>
                <option value="S – Special Category">S – Special Category</option>
              </select>
            </div>
          </div>
          <div className="row flex mt-4">
        
          </div>
        

          <div className="mt-4 gap-5 flex">
            <button className="btn" onClick={sending}>Submit</button> <button className="btn"  onClick={() => {
                      setDisplay((prev) => {
                        const newDisplay = [...prev];
                        newDisplay[1] = "block";
                        newDisplay[0]="none"
                        return newDisplay;
                      });
                    }} >Go Back</button>
          </div>
       </div>
    </div>
        <div style={{display:display[1]}} className="container">
            <div className="row  mt-5">
                <div className="col-12">
                    <center><h1 className="display-3">Avaliable Shows</h1></center>
                </div>
                 <div className="row mt-5">
                                <div className="col-12 cont flex">
                                    {
                                      movies && movies.length==0?<center><h1 className="text-secondary">No Avaliable Shows</h1></center>:
                                      movies.map((ele,idx)=>{
                                        return(
                                          <div data-aos="zoom-out" className="cards fcol flex">
                                        <div className="imgs imgs2"style={{backgroundImage:`url(${ele.posterurl})`}}></div>
                                        <h6 className="text-white">Movie Name : {ele.movie}</h6>
                                        <h6 className="text-secondary">{ele.certificate}</h6>
                                        <div className="flex gap-2">
                                           <button className="btn bg-danger" onClick={()=>{deleting(ele)}}>Delete</button>
                                         
                                          <button onClick={() => navigate('/addeleteshow', { state: ele })} className="btn">Delete Show</button>
                                        </div>
                                    </div> 
                                        )
                                      })
                                    }
                
                                </div>
                            </div>
            </div>
        </div>
        </>
    )
}
export default Avl;