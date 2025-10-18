import { useState } from "react";
import axios from "axios"
import { Link } from "react-router-dom";
import {toast} from "react-toastify"
import { useEffect } from "react";

function Adup() {
  const form=new FormData()
  form.append('name',"sundar")
  const [Upcomming,setUpcomming]=useState([])
  const server=import.meta.env.VITE_SERVER
  
  useEffect(()=>{
    axios.get(server+'adup').then(res=>{
      setUpcomming(res.data)
      console.log(res.data)
    })
  },[])

  console.log()

  var [display, setDisplay] = useState(["none", "flex"]);
  var [movie,setMovie]=useState({})
  var [trailer,setTrailer]=useState(null)
  var [poster,setPoster]=useState(null)
   async function sending() {
    if(!poster || !trailer || !movie.movie || !movie.release){
      toast.error("Please provide a movie details and files correctly...")
      return
    }
    const forms=new FormData();
    forms.append('url',Date.now())
    forms.append('poster',poster)
    forms.append('trailer',trailer)
    forms.append('movie',movie.movie)
    forms.append('release',movie.release)
    console.log(forms) 
   await axios.post(server+'adupchecking',{movie:movie.movie}).then(res=>{
    if(res.data.length!=0){
        toast.warn("This movie is Already exist on Upcomming section")
        return ;
    }
    else{
      toast.promise(axios.post(server+"adup",forms),{pending:"Please wait",success:"Movie details submitted",error:"Data Not Added"}).then(async ()=>{
       const res=await axios.get(server+'adup')
        setUpcomming(res.data)
        setDisplay((prev)=>{
          const newDisplay=[...prev]
          newDisplay[0]='none'
          newDisplay[1]='flex'
          return newDisplay
        })
    }  
    )
    }
   })
    
  }
  async function deleting(element) {
    var a=confirm("Are You Sure to Remove this Movie From Upcomming Section?")
    if(a){
      await axios.delete(server+"adup/"+element._id,{data:element}).then(res=>{
        toast.success(res.data)
      }).then(async ()=>{
         const res=await axios.get(server+'adup')
        setUpcomming(res.data)
      })
    }
  }

  return (
    <>
    <div onClick={() => {
   
                      setDisplay((prev) => {
                        
                        const newDisplay = [...prev];
                        newDisplay[0] = "flex";
                        newDisplay[1]="none"
                        return newDisplay;
                      });
                    }} className="add flex">+</div>
    <div style={{display:display[0]}} className="container flex cont100">
       <div className="boxesAdup container ">
      
        <div className="row flex">
            <div className="col-8">
             <center><h1>Enter the Details</h1></center>
            </div>
          </div>
          <div className="row flex mt-1">
            <div className="col-8">
              <label htmlFor="" className="form-label">Please select a Trailer Video</label>
              <input type="file" accept="video/mp4" onChange={(e)=>setTrailer(e.target.files[0])} className="form-control form2 w-100" />
            </div>
          </div>
          <div className="row flex">
            <div className="col-8">
              <label htmlFor="" className="form-label">Please select a Landascape Poster</label>
              <input type="file" accept=".jpg,.jpeg" onChange={(e)=>setPoster(e.target.files[0])} className="form-control form2 w-100" />
            </div>
          </div>
          <div className="row flex">
            <div className="col-8">
              <label htmlFor="" className="form-label">Movie Name</label>
              <input type="text" onChange={(e)=>{setMovie({...movie,movie:e.target.value})}}  className="form-control form2 w-100" />
            </div>
          </div><div className="row flex ">
            <div className="col-8">
              <label htmlFor="" className="form-label">Move Release date</label>
              <input type="date" onChange={(e)=>{setMovie({...movie,release:e.target.value})}} className="form-control form2 w-100" />
            </div>
          </div>

        

          <div className="mt-4 gap-5 flex">
            <button className="btn" onClick={sending}> Submit</button> <button className="btn"  onClick={() => {
                      setDisplay((prev) => {
                        const newDisplay = [...prev];
                        newDisplay[1] = "flex";
                        newDisplay[0]="none"
                        return newDisplay;
                      });
                    }} >Cancel</button>
          </div>
       </div>
    </div>
      <div style={{ display: display[1] }} className="container flex fcol">
        <div className="row mt-5">
          <div className="col-12">
            <center>
              {Upcomming.length!=0?<h1>Upcomming Movies List</h1>:""}
            </center>
          </div>
        </div>
        <div className="row">
          <div className="col mt-5 flex gap-3 flex-wrap">
            {
             Upcomming.length==0?<h1 className="text-secondary">No Upcomming Movies</h1>: Upcomming.map((ele,idx)=>{
                return(
                  <div
              data-aos="zoom-out"
              style={{ display: display[1] }}
              className="cards fcol flex"
            >
              <div
                className="imgs imgs2"
                style={{
                  backgroundImage: `url(${ele.poster})`,
                }}
              ></div>
              <h6 className="text-white">Movie Name : {ele.movie}</h6>
              <h6 className="text-secondary">Released On {ele.release}</h6>
              <div>
              
                <Link>
                  <button className="btn bg-danger" onClick={()=>deleting(ele)}>Delete</button>
                </Link>
              </div>
            </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </>
  );
}
export default Adup;
