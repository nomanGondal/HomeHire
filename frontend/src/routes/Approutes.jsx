import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from '../pages/Landing/Landing'
import Signup from '../pages/signup/Signup'
import OtpVerification from '../pages/signup/OtpVarification'
import Login from '../pages/login/Login'
const Approutes = () => {
  return (
    
     <BrowserRouter>
        <Routes>
            <Route path='/' element={<Landing/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path="/verify-otp" element={<OtpVerification/>} />
            <Route path='/login' element={<Login/>} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
     </BrowserRouter>


  )
}

export default Approutes