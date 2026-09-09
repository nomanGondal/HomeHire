import { ArrowLeft, Compass, Home, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import './NotFound.css'

const PageNotFound = () => {
  return (
    <div className="not-found-page">
      <Navbar />

      <main className="not-found-content">
        <div className="not-found-illustration" aria-hidden="true">
          <span className="not-found-number">4</span>
          <div className="not-found-icon-wrap">
            <SearchX size={64} strokeWidth={1.5} />
          </div>
          <span className="not-found-number">4</span>
        </div>

        <div className="not-found-copy">
          <p className="not-found-eyebrow">
            <Compass size={16} />
            Off the map
          </p>
          <h1>We couldn&apos;t find that page</h1>
          <p>
            The page may have moved, or the link might be incorrect. Let&apos;s get
            you back to trusted help at home.
          </p>
        </div>

        <div className="not-found-actions">
          <Link to="/" className="not-found-primary-action">
            <Home size={18} />
            Back to home
          </Link>
          <Link to="/services" className="not-found-secondary-action">
            Browse services
            <ArrowLeft size={17} className="not-found-arrow" />
          </Link>
        </div>
      </main>
    </div>
  )
}

export default PageNotFound