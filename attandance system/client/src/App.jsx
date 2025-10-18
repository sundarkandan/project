import { useState } from 'react'
import './App.css'
import { Routes,Route} from 'react-router-dom'
import Home from './components/Home'
import Admin from './components/Admin'
import Staff from './components/staff'
import AlterStudent from './components/AlterStudent'
import AddDepartment from './components/AddDepartment'
import NewStudent from './components/NewStudent'
import AddAttendance from './components/AddAttendance'
import AddBatch from './components/AddBatch'
import Checkattendance from './components/Checkattendance'
import DeleteAttendance from './components/DeleteAttendance'
import Delelterecords from './components/delelterecords'
import Studentdeletes from './components/studentdeletes'
import DeleteOne from './components/DeleteOne'
import AlterAttendance from './components/AlterAttendance'
import PassChange from './components/PassChange'
import MissingAttendance from './components/MissingAttendance'
import CheckPermenant from './components/CheckPermenant'
function App() {

  return (
   <Routes>
    <Route path='/' element={<Home/>}></Route>
    <Route path='/admin' element={<Admin/>}></Route>
    <Route path='/staff' element={<Staff/>}></Route>
    <Route path='/alterStudent' element={<AlterStudent/>}/>
    <Route path='/addDepartment' element={<AddDepartment/>}/>
    <Route path='/newstudent' element={<NewStudent/>}/>
    <Route path="/addattendance" element={<AddAttendance/>}/>
    <Route path="/addbatch" element={<AddBatch/>}/>
    <Route path="/checkattendance" element={<Checkattendance/>}/>
    <Route path="/deleteAttendance" element={<DeleteAttendance/>}/>
    <Route path='/delelterecords' element={<Delelterecords/>}/>
    <Route path='/studentdeletes' element={<Studentdeletes/>}/>
    <Route path='/deleteone' element={<DeleteOne/>}/>
    <Route path="/alterattendance"element={<AlterAttendance/>}/>
    <Route path="/passchange"element={<PassChange/>}/>
    <Route path="/missingattendance"element={<MissingAttendance/>}/>
    <Route path="/checkpermenant"element={<CheckPermenant/>}/>
    
   </Routes>
  )
}

export default App
