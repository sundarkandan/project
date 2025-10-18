import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init({
  duration: 500,
  once: false,
});


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
    <ToastContainer  
position="top-right"
autoClose={2000}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"

/>
    <App />
    </BrowserRouter>
  </>,
)
