import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from '../pages/Landing/Landing'
import Signup from '../pages/signup/Signup'
import OtpVerification from '../pages/signup/OtpVarification'
import Login from '../pages/login/Login'
import CustomerDashboard from "../pages/Customer/CustomerDashboard";
import ProtectedRoute from "../components/common/ProtectedRouter";
import CheckProfile from "../pages/Provider/CheckProfile";
import ProviderProfileSetup from "../pages/Provider/ProviderSetupPage";
const Approutes = () => {
  return (
    
     <BrowserRouter>
        <Routes>
            <Route path='/' element={<Landing/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path="/verify-otp" element={<OtpVerification/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/provider/check-profile' element={<ProtectedRoute allowedRoles={['provider']}><CheckProfile/></ProtectedRoute>}/>
            <Route path='/provider/home' element={<ProtectedRoute allowedRoles={['provider']}><h1>Provider Home</h1></ProtectedRoute>}/>
            <Route path='/provider/profile/setup' element={<ProtectedRoute allowedRoles={['provider']}><ProviderProfileSetup/></ProtectedRoute>}/>
            <Route path='/customer/dashboard' element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard/></ProtectedRoute>}/>
            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
     </BrowserRouter>


  )
}

export default Approutes