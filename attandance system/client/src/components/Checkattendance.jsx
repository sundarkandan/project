import { useEffect, useState } from "react";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate,Link } from "react-router-dom"

function Checkattendance(){
    const server="http://localhost:3000";
       const [Student,setStudent]=useState([])
       const [batch,setbatch]=useState([]);
       const [dept,setDept]=useState([])
       const [today,setToday]=useState('')
       const [present,setPresents]=useState([])
       const[score,setScore]=useState([])
       const[score2,setScore2]=useState([])
       var[getting,setGetting]=useState({dept:'',batch:""})
       var[btn,setBtn]=useState(false)
         const navigate=useNavigate()
       
    var[dialog,setDialog]=useState(false)
        var[current,setCurrent]=useState('');
           var[newp,setNew]=useState('');
       useEffect(()=>{
           axios.get(server+"/alterStudent").then(res=>{
               setStudent(res.data.getting);
               setToday(res.data.getting2)
               
               axios.post(server+"/prestudent",res.data.getting).then(res=>{
                setPresents(res.data.getting)
                const newScors = res.data.getting.filter(ele=>ele && ele.length>0).map((ele, idx) => {
                    return{
                        rollno:ele[0].rollno,
                        name: ele[0].name,
                        dept:ele[0].dept,
                        year:ele[0].batch,
                        results: ele.map((ele2, idx2) => ele2.attendance),
                        hours: Math.max(0,ele.map((ele2, idx2) => ele2.attendance.filter(a => a === true).length-1).reduce((cur,next)=>cur+next,0))+"/"+res.data.getting2.length*5,
                        days:ele.map((ele2, idx2) => ele2.attendance.includes(true)?1:0).reduce((cur,next)=>cur+next,0)+"/"+res.data.getting2.length,
                        penalty:ele.map((ele2, idx2) => ele2.attendance.includes(true)?1:0).reduce((cur,next)=>cur+next,0)-ele.map((ele2, idx2) =>ele2.attendance.includes(true)&&ele2.attendance[0]==false && !ele2.attendance.every(val => val === ele2.attendance[0])?.5:0).reduce((cur,next)=>cur+next,0)+"/"+res.data.getting2.length,
                        absented_hours:today.length*5-ele.map((ele2, idx2) => ele2.attendance.filter(a => a === true).length-1).reduce((cur,next)=>cur+next,0),
                        absent:ele.map((ele2, idx2) => !ele2.attendance.includes(true)?1:0).reduce((cur,next)=>cur+next,0),
                        percentage:Math.floor(Math.max(0,Math.floor(ele.map((ele2, idx2) => ele2.attendance.includes(true)?1:0).reduce((cur,next)=>cur+next,0))/(res.data.getting2.length)*100))+"%",
                        
                        percentage2:Math.floor(Math.max(0,Math.floor(ele.map((ele2, idx2) => ele2.attendance.filter(a => a === true).length-1).reduce((cur,next)=>cur+next,0))/(res.data.getting2.length*5)*100))+"%",

                        percentage3:Math.floor(Math.max(0,Math.floor((ele.map((ele2, idx2) => ele2.attendance.includes(true)?1:0).reduce((cur,next)=>cur+next,0))-ele.map((ele2, idx2) =>ele2.attendance.includes(true)&&ele2.attendance[0]==false && !ele2.attendance.every(val => val === ele2.attendance[0])?.5:0).reduce((cur,next)=>cur+next,0)))/(res.data.getting2.length)*100)+"%",
                    }
                   
                });
                setScore(newScors)
                console.log(newScors)
                setScore2(newScors)
               })
           })
          
           axios.get(server+"/newstudent").then(res=>{
               setbatch(res.data.batch)
               setDept(res.data.dept)
               console.log(res.data.batch)
               
           })
       },[])
       function nor(){
          setScore(score2)
       }
     async function sending(){
       
        if(getting.dept && getting.batch && newp){
            await axios.post(server+"/permenant",{dept:getting.dept,batch:getting.batch,sem:newp,datas:score}).then(res=>toast.success(res.data))
        }
        else{
            toast.warn("Please Select Semester")
        }
     }
      async function finding(data, con) {
           if (!data) {
               setScore(score2)
               return;
           }
           let filtered=[];
           if (con==='stu') {
               filtered=score2.filter(ele=>ele.rollno.toString().includes(data));
               setScore(filtered);
           } else if (con==='dept') {
            filtered=score2.filter(ele=>ele.dept.toString().includes(data));
            setScore(filtered);
           } else if (con==='year') {
            filtered=score2.filter(ele=>ele.year.toString().includes(data));
            setScore(filtered);
           }else if(con=='two'){
               if(data.dept&&data.batch){
                const filtered=score2.filter(ele=>ele.year.toString().includes(data.batch) && ele.dept.toString().includes(data.dept));
                setScore(filtered);
               }
           }
       
           
       }
       
       return(
         <>
          <div className=" navi mt-5 ms-5">
        <Link to='/' className="btn btn1">/Home</Link>
        <Link to='/staff' className="btn btn1">/Staff</Link>
      </div>
          <center><h1 className="no-print display-5">Merit Arts And Science Colleage-Idaikkal</h1></center>
            <div className="row bgs">
            <div className="no-print mt-5"><h3 className="select">Department: {getting.dept}</h3><h3 className="select">batch: {getting.batch}</h3></div>

            </div>
          <div className="container">
           
            <ToastContainer position="top-right" theme="colored" autoClose={3000} />
            {
                dialog?<div className="row savep">
            <div className="col fh flex ">
              <div className="box savep bg flex gap f-col ms-5">
              
               
                

            <h3>Department :{getting.dept}</h3>
            <h3>Batch :{getting.batch}</h3>
               

                
                <select type="text" value={newp} onChange={e=>setNew(e.target.value)} className="form-control" placeholder="New password"  >
                    <option value="">Click Select the Semster</option>
                    <option value="1" className="black">1</option>
                    <option value="2" className="black">2</option>
                    <option value="3" className="black">3</option>
                    <option value="4" className="black">4</option>
                    <option value="5" className="black">5</option>
                    <option value="6" className="black">6</option>   
                </select>       

                <div><button className="btn btn1" onClick={sending}>Click to Save</button>  <button className="btn btn1" onClick={()=>setDialog(false)}>Cancel</button></div>
              </div>
            </div>
        </div>:""
            }
           <div className="row mt-4">
              <div className="col-12 title"><center><h1>Merit College Attendance System</h1></center></div>
           </div>
           <div className="row">
            <div className="col-12 pri-view"><h1>Department:Cs</h1><h1>Year:2023</h1></div>
           </div>
           <div className="row mt-5">
               <div className="col-4"><input type="text" className="form-control"  onChange={(e)=>finding(e.target.value,'stu')} placeholder="Search the Student Using Roll Number"/></div>
             
               <div className="col-3">
               
                   <select name="" className="form-control" value={getting.dept} onChange={(e)=>{finding(e.target.value,'dept');setGetting({...getting,dept:e.target.value})}} id="">
                       <option value="" className="cyan">Select Dept</option>
                       {
                           dept.map((ele,idx)=>{
                               return(
                                   <option key={idx} value={ele.dept} className="select">{ele.dept}</option>
                               )
                           })
                       }
                   </select>
               </div>
               <div className="col-3">
                   <select name="" className="form-control" value={getting.batch} onChange={(e)=>{finding(e.target.value,'year');setGetting({...getting,batch:e.target.value})}} id="">
                       <option value="" className="cyan">Select Year</option>
                       {
                           batch.map((ele,idx)=>{
                               return(
                                   <option key={idx} value={ele.batch} className="select">{ele.batch}</option>
                               )
                           })
                       }
                   </select>
               </div>
               <div className="col-2">
                 <button className="btn btn1" onClick={()=>{finding(getting,'two');setBtn(true)}}>Find</button> <button onClick={()=>{setGetting({dept:"",batch:""});nor()}} className="btn btn1">Cancel</button>
                 </div>
           </div>
           <div className="row">
               <div className="col-12"><center><button className="btn btn1 mt-5 w-25" onClick={()=>{console.log(score);window.print()}}>Print</button> {btn && getting.dept && getting.batch?<button onClick={()=>setDialog(true)} className="btn btn1 mt-5 w-25">Save this records Permanantly</button>:""}</center></div>
           </div>
           <div className="row mt-5 mb-5">
               <div className="col">
                  {
                   <table className="w-100 table">
                   <thead>
                      <tr>
                      <th>Roll Number</th>
                       <th>Student name</th>
                       <th>dept</th>
                       <th>Year</th>
                       <th>Hours</th>
                       <th>Days</th>
                       <th>Days(with first hour penalty)</th>
                       <th>Absented Days</th>
                       <th>percentage(Days)</th>
                       <th>percentage(Hour)</th>
                       <th>percentage(penalty days)</th>
                      </tr>
                   </thead>
                   <tbody className="custom-bg">
                       {
                           score.map((ele,idx)=>{
                               return(
                                   <tr key={idx}>
                           <td>{ele.rollno}</td>
                           <td>{ele.name}</td>
                           <td>{ele.dept}</td>
                           <td>{ele.year}</td>
                           <td>{ele.hours}</td>
                           <td>{ele.days}</td>
                           <td>{ele.penalty==0?'no':ele.penalty}</td>
                           <td>{ele.absent==0?'no absent':ele.absent}</td>
                           <td>{ele.percentage}</td>
                           <td>{ele.percentage2}</td>
                           <td>{ele.percentage3}</td>
                       </tr>
                               )
                           })
                       }
                   </tbody>
               </table>
                  }
               </div>
           </div>
          </div>
         </>
       )
}
export default Checkattendance;