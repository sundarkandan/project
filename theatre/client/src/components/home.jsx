import { useEffect, useState } from "react";
import { useRef } from "react";
import Leo from "../videos/leo.mp4";
import axios from "axios"
function Home() {
    var videRef=useRef([])
  const server=import.meta.env.VITE_SERVER
  var [disp, setDisp] = useState("none");
  const[Upcomming,setUpcomming]=useState([])
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setDisp("none");
    });
    axios.get(server+"adup").then(res=>{setUpcomming(res.data);console.log(res.data)})
  },[]);
  return (
    <>
      <div className="container mt-5">
        <div
          className="scroll fixed-bottom ms-5 mb-5 text-center"
          style={{ display: disp }}
        >
          <h4>
            Scroll To View <br /> v
          </h4>
        </div>
        <div className="row flex">
          <div
         
            className="col-md-9 flex wrap mt-5  gaps"
          >
           {
            Upcomming.map((ele,idx)=>{
              return(
                 <div
                    onMouseEnter={async () => {
              videRef.current[idx].style.display="block";
              await videRef.current[idx].play()
              videRef.current[idx].playbackRate=3.0
            }}
            onMouseLeave={async () => {
              videRef.current[idx].style.display="none"
              await videRef.current[idx].pause()
              
            }}
              className="imgs flex"
              data-aos="zoom-out"
              style={{
                backgroundImage: `url(${ele.poster})`,
              }}
            >
             <video
              ref={(el) => { videRef.current[idx] = el }}
              className="triler"
              src={ele.trailer}
              loop
              muted
              style={{ display: "none" }} 
            ></video>
              <div className="inners fcol">
                <h5 className="details ">Movie: {ele.movie}</h5>
                <h5 className="details">Released On {ele.release}</h5>
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
export default Home;
