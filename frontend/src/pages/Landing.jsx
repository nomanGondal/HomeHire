import {Link} from 'react'
import Navbar from '../components/common/Navbar'
import {ShieldCheck,CircleCheck, MessageCircle,Clock} from "lucide-react"
const Landing = () => {
  return (
    
    <div>
        <Navbar/>
        <div className="flex items-center gap-2">
            <ShieldCheck />
            <span>Verified local professionals in Lahore</span>
        </div>
        <div>
          <h1>Find Trusted Home Service <br/> Professionals Near You</h1>
          <p>Book verified electricians, plumbers, AC technicians, carpenters, and <br/>appliance 
            repair experts with clear quotations,
             local availability, and fast <br/> booking.</p>
        
        </div>
        <div>
          <Link to="/services">
            Find a Service
          </Link>
          <Link to="/providers">
            Become a Service Provider
          </Link>
        </div>
        <div>
          <p><span><CircleCheck/>Cash on delivery supported</span>
           <span><MessageCircle/>Urdu / English ready</span>
           <span><Clock/>Fast local response</span></p>
          <img src="../assets/hero.jpeg" alt="Hero" />
        </div>
    </div>
  )
}

export default Landing