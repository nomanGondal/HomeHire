import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from '../pages/Landing'

const Approutes = () => {
  return (
    
     <BrowserRouter>
        <Routes>
            <Route path='/' element={<Landing/>}/>
        </Routes>
     </BrowserRouter>


  )
}

export default Approutes