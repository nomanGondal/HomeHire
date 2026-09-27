import { Wallet, Clock, X } from "lucide-react";
import "./css/Quotesmodel.css"
const QuotesModal = ({ quotes, loading, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="quotes-modal-header">
          <h2>Received Quotes</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <p className="quotes-loading">Loading quotes...</p>
        ) : quotes.length === 0 ? (
          <p className="quotes-loading">No quotes received yet.</p>
        ) : (
          <div className="quotes-list">
            {quotes.map((quote) => (
              <div className="quote-card" key={quote._id}>
                <div className="quote-card-top">
                  <span className="quote-provider-name">{quote.provider?.name}</span>
                  <span className="quote-price">
                    <Wallet size={14} /> PKR {quote.price}
                  </span>
                </div>

                <p className="quote-message">{quote.message}</p>

                <div className="quote-meta">
                  <span><Clock size={13} /> Est. {quote.estimatedDuration}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

     
    </div>
  );
};

export default QuotesModal;