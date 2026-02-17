import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import AIWebBuilder from './components/AIWebBuilder';
import { Route,Routes } from 'react-router-dom';
import Auth from './components/Auth';
import Workspace from './components/Workspace';
import GeneratedPage from './components/GeneratedPage';
import ImageToUrl from './components/ImgToUrl';
function App() {
  return(
    <Routes>
      <Route path='/Aibuilder' element={<AIWebBuilder/>}/>
      <Route path='/workspace' element={<Workspace/>}/>
      <Route path='/generated' element={<GeneratedPage/>}/>
      <Route path='/imagetourl' element={<ImageToUrl/>}/>
      <Route path='/' element={<Auth/>}/>
    </Routes>
  )
}
export default App;