import { Link,useNavigate } from "react-router-dom";
function Staff(){
  const navigateing=useNavigate()
    return(
        <>
        <div className=" navi mt-5 ms-5">
        <Link to='/' className="btn btn1">/Home</Link>
    
      </div>
        <div className="container flex f-col gap fh">
        <h1 className="display-3">Staff Pannel</h1>
           <Link to="/addattendance" className="btn flex btn2">Add Attendance</Link>
           <Link to="/checkattendance" className="btn flex btn2">Check the Attendance</Link>
           <Link to="/deleteAttendance" className="btn flex btn2">Remove the Attendance</Link>
           <Link to="/checkpermenant" className="btn flex btn2">Check the Old attendance</Link>
       </div></>
    )
}
export default Staff;