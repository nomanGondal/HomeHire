import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from '../pages/Landing/Landing'
import Signup from '../pages/signup/Signup'
import CustomerSignup from "../pages/signup/CustomerSignup";
const Approutes = () => {
  return (
    
     <BrowserRouter>
        <Routes>
            <Route path='/' element={<Landing/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path="/signup/customer" element={<CustomerSignup/>} />
            <Route path="/signup/provider" element={<div>Provider Signup Form (coming soon)</div>} />  
        </Routes>
     </BrowserRouter>


  )
}

export default Approutes