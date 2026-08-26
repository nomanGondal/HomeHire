import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from '../pages/Landing/Landing'
import Signup from '../pages/signup/Signup'

const Approutes = () => {
  return (
    
     <BrowserRouter>
        <Routes>
            <Route path='/' element={<Landing/>}/>
            <Route path='/signup' element={<Signup/>}/>
            
        </Routes>
     </BrowserRouter>


  )
}

export default Approutes