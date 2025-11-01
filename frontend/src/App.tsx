
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';

function App() {
            
  

  return (
    <>
              <Navbar/>
        <div className='min-h-screen bg-gray-800 text-white'>
                 
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/profile" element={<Profile/>}/>
              
           
          </Routes>
                
        </div>
         <ToastContainer/>
     
    </>
  )
}

export default App
