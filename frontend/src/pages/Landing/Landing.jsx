import { Link } from 'react-router-dom'
import { ShieldCheck, CircleCheck, MessageCircle, Clock } from "lucide-react"
import Navbar from '../../components/common/Navbar'
import Services from '../Landing/components/Services'
import heroImg from '../../assets/Hero.jpg'
import HowItWork from '../Landing/components/HowItWork'
import WhyHomehire from '../Landing/components/WhyHomehire'
import ProviderCTA from './components/ProviderCTA'
import Testimonials from './components/Testimonials'
import Faq from './components/Faq'
import FinalCTA from './components/FinalCTA'
import Footer from '../../components/common/Footer'

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-14 pb-20 grid md:grid-cols-2 gap-12 items-center">
        
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 bg-offwhite border border-borderc text-brand text-sm font-medium px-4 py-1.5 rounded-full">
            <ShieldCheck size={16} />
            <span>Verified local professionals in Lahore</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-navy tracking-tight">
            Find Trusted Home Service <br className="hidden md:block" />
            Professionals Near You
          </h1>

          <p className="text-slate text-base leading-relaxed max-w-md">
            Book verified electricians, plumbers, AC technicians, carpenters, and
            appliance repair experts with clear quotations, local availability, and fast booking.
          </p>

          <div className="flex flex-wrap gap-4 mt-2">
            <Link
              to="/services"
              className="bg-brand hover:bg-brand-hover text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Find a Service
            </Link>
            <Link
              to="/providers"
              className="border border-borderc hover:border-brand text-navy font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Become a Service Provider
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-slate">
            <span className="flex items-center gap-1.5">
              <CircleCheck size={16} className="text-brand" />
              Cash on delivery supported
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle size={16} className="text-brand" />
              Urdu / English ready
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={16} className="text-brand" />
              Fast local response
            </span>
          </div>
        </div>

       
        <div className="relative">
          <div className="absolute -inset-4 bg-brand/5 rounded-3xl -z-10" />
          <img
            src={heroImg}
            alt="Technician helping a customer at home"
            className="w-full h-auto rounded-2xl border border-borderc shadow-sm object-cover"
          />
        </div>
      </section>
   
      <Services />
      <HowItWork/>
      <WhyHomehire/>
      <ProviderCTA/>
      <Testimonials/>
      <Faq/>
      <FinalCTA/>
      <Footer/>
    </div>
  )
}

export default Landing