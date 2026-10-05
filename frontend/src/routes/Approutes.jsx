import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from '../pages/Landing/Landing'
import Signup from '../pages/signup/Signup'
import OtpVerification from '../pages/signup/OtpVarification'
import Login from '../pages/login/Login'

import ProtectedRoute from "../components/common/ProtectedRouter";
import CheckProfile from "../pages/Provider/CheckProfile";
import ProviderProfileSetup from "../pages/Provider/ProviderSetupPage";
import ProviderLayout from "../pages/Provider/components/ProviderLayout";
import ProviderServices from "../pages/Provider/ProviderServices";
import ProviderBookings from "../pages/Provider/ProviderBookings";
import ProviderMessages from "../pages/Provider/ProviderMessages";
import ProviderQuotes from "../pages/Provider/ProviderQuotes";
import ProviderProfile from "../pages/Provider/ProviderProfile";
import ProviderHome from "../pages/Provider/ProviderHome";
import CustomerLayout from "../pages/Customer/components/CustomerLayout";
import CustomerHome from "../pages/Customer/CustomerHome";
import CustomerFindProviders from "../pages/Customer/CustomerFindProviders";
import CustomerBookings from "../pages/Customer/CustomerBookings";
import CustomerMessages from "../pages/Customer/CustomerMessages";
import CustomerRequests from "../pages/Customer/CustomerRequests";
import CustomerProfile from "../pages/Customer/CustomerProfile";
import CustomerQuotes from "../pages/Customer/CustomerQuotes"
import CustomerProviderProfile from "../pages/Customer/CustomerProviderProfile";
import Notification from "../pages/shared/Notification";
import PageNotFound from "../pages/PageNotFound";
const Approutes = () => {
   return (

      <BrowserRouter>
         <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/signup' element={<Signup />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path='/login' element={<Login />} />
            <Route path='/provider/check-profile' element={<ProtectedRoute allowedRoles={['provider']}><CheckProfile /></ProtectedRoute>} />


            <Route path='/provider' element={<ProtectedRoute allowedRoles={['provider']}>
               <ProviderLayout />
            </ProtectedRoute>}>
               <Route path="home" element={<ProviderHome />} />
               <Route path="services" element={<ProviderServices />} />
               <Route path="bookings" element={<ProviderBookings />} />
               <Route path="messages" element={<ProviderMessages />} />
               <Route path="quotes" element={<ProviderQuotes />} />
               <Route path="profile" element={<ProviderProfile />} />
            </Route >
            <Route path='/provider/profile/setup' element={<ProtectedRoute allowedRoles={['provider']}><ProviderProfileSetup /></ProtectedRoute>} />

            <Route path='/customer'
               element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout /></ProtectedRoute>} >
               <Route path="home" element={<CustomerHome />} />
               <Route path="find-providers" element={<CustomerFindProviders />} />
               <Route path="bookings" element={<CustomerBookings />} />
               <Route path="messages" element={<CustomerMessages />} />
               <Route path="requests" element={<CustomerRequests />} />
               <Route path="profile" element={<CustomerProfile />} />
               <Route path="notifications" element={<Notification />} />
               <Route path="requests/:requestId/quotes" element={<CustomerQuotes />} />
               <Route path="provider/:providerId" element={<CustomerProviderProfile />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
         </Routes>
      </BrowserRouter>


   )
}

export default Approutes