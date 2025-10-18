import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"

function MissingAttendance() {
    const server="http://localhost:3000";
    const [studentsToDisplay, setStudentsToDisplay]=useState([]);
    const [days,setDays]=useState([]);
    const [groupedAttendances, setGroupedAttendances]=useState([]);
  const navigate=useNavigate()

    useEffect(()=>{
        axios.get(server+"/missing").then(res=>{
            const { student: allStudents, present, days }=res.data;
            setDays(days);
            const rollMap={};
            const grouped=[];

            present.forEach(entry=>{
                
                if (!rollMap[entry.rollno]) {
                    rollMap[entry.rollno]=[];
                    grouped.push(rollMap[entry.rollno]);
                }
                rollMap[entry.rollno].push(entry);
            });
            setGroupedAttendances(grouped);

            
            const attendedRolls=present.map(p=>p.rollno);
            const neverAttended=allStudents.filter(stu=>!attendedRolls.includes(stu.rollno));

            
            const incomplete=grouped.filter(att=>att.length < days.length);
            const missingSomeDays=incomplete.map(group=>({ ...group[0] }));

            setStudentsToDisplay([...neverAttended, ...missingSomeDays]);
        });
    }, []);

    const getMissingDates=(rollno)=>{
        const studentGroup=groupedAttendances.find(group=>group[0].rollno === rollno) || [];
        const attendedDates=studentGroup.map(entry=>entry.date);
        const missingDates=days
            .filter(day=>!attendedDates.includes(day.today))
            .map(day=>day.today);
        return missingDates.join(", ");
    };

    return (
        <div className="container">
            <div className="row mt-4">
                {studentsToDisplay.length > 0 && (
                    <div className="col-12 title">
                        <center><h1>Not Completed Attendance List</h1></center>
                    </div>
                )}
            </div>

            <div className="row mt-5 mb-5">
                <div className="col">
                    {studentsToDisplay.length > 0 ? (
                        <table className="w-100 table">
                            <thead>
                                <tr>
                                    <th>Roll Number</th>
                                    <th>Student Name</th>
                                    <th>Department</th>
                                    <th>Year</th>
                                    <th>Missing Dates</th>
                                </tr>
                            </thead>
                            <tbody className="custom-bg">
                                {studentsToDisplay.map((student, idx)=>(
                                    <tr key={idx}>
                                        <td>{student.rollno}</td>
                                        <td>{student.name}</td>
                                        <td>{student.dept}</td>
                                        <td>{student.batch}</td>
                                        <td>{getMissingDates(student.rollno)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <center><h1 className="display-5">All Attendance Completed </h1></center>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MissingAttendance;
