import { useState } from 'react'
import {Routes,Route} from 'react-router-dom'
import './App.css'
import Main from './components/Main'

import Home from './components/home'
import Tickets from './components/Tickets'
import Contact from './components/Contact'
import Book from './components/Book'
import Dates from './components/Date'
import Foods from './components/Foods'
import Booked from './components/Booked'
import Parking from './components/Parking'
import Layout from './components/layout'
import Admin from './components/Admin/Admin'
import Avl from './components/Admin/Avl'
import Adtime from './components/Admin/adtime'
import Adup from './components/Admin/Adup'
import Food from'./components/Admin/foods'
import AdBooked from './components/Admin/AdBooked'
import Deleteshow from './components/Admin/Deleteshow'
import Addate from './components/Admin/addate'
function App() {
  const [count, setCount] = useState(0)
return(
  <Routes>
      <Route path='/book' element={<Book/>}/>
      <Route path='/date' element={<Dates/>}/>
      <Route path='/foods' element={<Foods/>}/>
      <Route path='/parking' element={<Parking/>}/>
      <Route path='/adfood' element={<Food/>}/>
      <Route path='/avl' element={<Avl/>}/>
      <Route path='/adup' element={<Adup/>}/>
      <Route path='/booked' element={<Booked/>}/>
      <Route path='/ticket-layout' element={<Layout/>}/>
      <Route path='/admin' element={<Admin/>}/>
      <Route path='/adBooked' element={<AdBooked/>}/>
      <Route path='/addate' element={<Addate/>}/>
      <Route path='/adtime' element={<Adtime/>}/>
      <Route path='/addeleteshow' element={<Deleteshow/>}/>
    <Route path='/' element={<Main/>}>
      <Route index element={<Home/>}/>
      <Route path='tickets' element={<Tickets/>}/>
      <Route path="contact" element={<Contact/>}/>
    </Route>
  </Routes>
)
  
}

export default App
