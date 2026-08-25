import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section className="bg-brand">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-20 flex flex-col items-center text-center gap-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Ready to get help from a trusted local professional?
        </h2>

        <p className="text-white/90 text-base leading-relaxed max-w-xl">
          Find a service now or join Ustaad as a provider and start receiving
          local customer requests.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <Link
            to="/services"
            className="bg-white text-brand hover:bg-offwhite font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Find a Service
          </Link>
          <Link
            to="/providers"
            className="border border-white/40 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Join as a Provider
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;