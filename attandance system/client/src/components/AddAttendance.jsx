import { useEffect, useState } from "react";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { Link,useNavigate } from "react-router-dom";
function AddAttendance(){
    const server="http://localhost:3000";
    const [Student,setStudent]=useState([])
    const [Student2,setStudent2]=useState([])
    const [batch,setbatch]=useState([]);
    var[disp,setDisp]=useState(false)
    const [dept,setDept]=useState([])
    const [today,setToday]=useState('')
    const [present,setPresents]=useState([])
    var[getting,setGetting]=useState({dept:'',batch:""})
  const navigate=useNavigate()

    useEffect(()=>{
        axios.get(server+"/alterStudent").then(res=>{
            setStudent(res.data.getting);
            setStudent2(res.data.getting);
        })
        axios.get(server+"/newstudent").then(res=>{
            setbatch(res.data.batch)
            setDept(res.data.dept)
        })
    },[])
    function nor2(date=today){
        var creating = Student.map(() => ({date:date,present:[true, true, true, true, true, true] }))
        setPresents(creating)
    }
    function nor(){
        axios.get(server+'/alterStudent').then(res=>{
            setStudent(res.data.getting)
        })
    }
    async function sending(){
        console.log(present,Student)
        console.log(today)
        const ToadayDate=new Date().toISOString().split('T')[0];
        console.log(ToadayDate)
        if(ToadayDate==today){
            if(getting.dept&&getting.batch){
          await axios.post(server+'/newattendance',{Student,present,role:"staff"}).then(res=>{
                if(res.data=="Today's attendance completed."){
                    toast.success(res.data)
                }
                else{
                    toast.error(res.data)
                }
                
            })
            await axios.post(server+"/days",{today,dept:Student[0].dept,year:Student[0].batch})
        }
        else{
            toast.error("Please filter your Students")
        }
        }
        else{
            var chec=confirm("Today date is "+ToadayDate+" But You Selected "+today+" is not correct Are You Sure to proceed today Attendance?")
            if(chec){
                if(getting.dept&&getting.batch){
                    await axios.post(server+'/newattendance',{Student,present,role:"staff"}).then(res=>{
                if(res.data=="Today's attendance completed."){
                    toast.success(res.data)
                }
                else{
                    toast.error(res.data)
                }
                
            })
            await axios.post(server+"/days",{today,dept:Student[0].dept,year:Student[0].batch})
            }
            else{
                toast.error("Please filter your Students")
            }
            }
            else{
                toast.warn(today+" Attendance was Cannceled")
            }

        }
        
    }
   async function finding(data, con) {
        if (!data) {
            nor();
            return;
        }
        let filtered=[];
        if (con==='stu') {
            filtered=Student.filter(ele=>ele.rollno.toString().includes(data));
            setStudent(filtered);
        } else if(con=='two'){
            if(data.dept&&data.batch){
               setDisp(true)
                await axios.get(server+'/finded',{params:{data,con}}).then(res=>{
                setStudent(res.data)
            })
            }else{
                toast.error('please select the department and year')
            }
        }
    
        
    }
    
    function checking(index,con){
        var copying=[...present]
        copying[index] = con ? {date:today,present:[true, true, true, true, true, true]} : {date:today,present:[false, false, false, false, false, false]};
        setPresents(copying)
    }
    return(
        <>
        <div className=" navi mt-5 ms-5">
        <Link to='/' className="btn btn1">/Home</Link>
        <Link to='/staff' className="btn btn1">/Staff</Link>
      </div>
       <div className="container">
          
         <ToastContainer position="top-right" theme="colored" autoClose={3000} />
        <div className="row mt-4">
           <div className="col"><center><h1>Merit College Attendance System</h1></center></div>
        </div>
        <div className="row mt-5">
            <div className="col-2"><input type="text" className="form-control"  onChange={(e)=>finding(e.target.value,'stu')} placeholder="Search the Student Using Roll Number"/></div>
            <div className="col-2"><input type="date" value={today} onChange={(e) => {const newDate = e.target.value;setToday(newDate);nor2(newDate);}}
 className="form-control" /></div>
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
              <button className="btn btn1" onClick={()=>finding(getting,'two')}>Find</button> <button onClick={()=>{setGetting({dept:"",batch:""});nor()}} className="btn btn1">Cancel</button>
              </div>
        </div>
       {disp? <div className="row">
            <div className="col-12"><center><button className="btn btn1 mt-5 w-25" onClick={sending}>submit</button></center></div>
        </div>:""}
        <div className="row mt-5 mb-5">
            <div className="col">
               {
                present.length>0? <table className="w-100 table">
                <thead>
                   <tr>
                   <th>Roll Number</th>
                    <th>Student name</th>
                    <th>dept</th>
                    <th>Year</th>
                    <th>Hour1</th>
                    <th>Hour2</th>
                    <th>Hour3</th>
                    <th>Hour4</th>
                    <th>Hour5</th>
                    <th>present</th>
                   </tr>
                </thead>
                <tbody className="custom-bg">
                    {
                        Student.map((ele,idx)=>{
                            return(
                                <tr key={idx}>
                        <td>{ele.rollno}</td>
                        <td>{ele.name}</td>
                        <td>{ele.dept}</td>
                        <td>{ele.batch}</td>
                        <td><input type="checkbox" checked={present[idx].present[0]} onChange={(e)=>{
                      
                                var isChecked=e.target.checked
                                var updating=[...present]
                                updating[idx].present[0]=isChecked;
                                setPresents(updating);
                               
                        }} className="form-check-input" /></td>
                        <td><input type="checkbox"checked={present[idx].present[1]}onChange={(e)=>{
                        
                                var isChecked=e.target.checked
                                var updating=[...present]
                                updating[idx].present[1]=isChecked;
                                setPresents(updating);
                                
                        }} className="form-check-input" /></td>
                        <td><input type="checkbox" checked={present[idx].present[2]} onChange={(e)=>{
      
                                var isChecked=e.target.checked
                                var updating=[...present]
                                updating[idx].present[2]=isChecked;
                                setPresents(updating);
                                
                        }} className="form-check-input" /></td>
                        <td><input type="checkbox" checked={present[idx].present[3]}  onChange={(e)=>{
                      
                                var isChecked=e.target.checked
                                var updating=[...present]
                                updating[idx].present[3]=isChecked;
                                setPresents(updating);
                        }} className="form-check-input" /></td>
                        <td><input type="checkbox" checked={present[idx].present[4]}  onChange={(e)=>{
                             
                                var isChecked=e.target.checked
                                var updating=[...present]
                                updating[idx].present[4]=isChecked;
                                setPresents(updating);
                                
                        }}className="form-check-input" /></td>
                        <td><input type="checkbox" checked={present[idx].present[5 ]}  onChange={(e)=>{
                                var isChecked=e.target.checked
                                var updating=[...present]
                                updating[idx].present[5]=isChecked;
                                setPresents(updating);
                                checking(idx,isChecked)
                        }} className="form-check-input" /></td>
                    </tr>
                            )
                        })
                    }
                </tbody>
            </table>:""
               }
            </div>
        </div>
       </div>
       </>
    )
}
export default AddAttendance;