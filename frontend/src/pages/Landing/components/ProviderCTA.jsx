import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const points = [
  "Create your profile and list your services.",
  "Receive quote requests from nearby customers.",
  "Build trust with reviews, ratings, and verification.",
];

const ProviderCTA = () => {
  return (
    <section className="bg-white">
  <div className="max-w-2xl mx-auto px-6 md:px-10 py-20 flex flex-col gap-6">
    <div>
      <h2 className="text-3xl font-bold text-navy tracking-tight">
        For Service Providers
      </h2>
      <p className="text-slate mt-2 text-base">
        Join Homehire to get local customer requests and grow your business.
      </p>
    </div>

    <ul className="flex flex-col gap-4">
      {points.map((point) => (
        <li key={point} className="flex items-start gap-3">
          <CheckCircle2 size={20} className="text-brand shrink-0 mt-0.5" />
          <span className="text-slate text-sm leading-relaxed">
            {point}
          </span>
        </li>
      ))}
    </ul>

    <Link
      to="/providers"
      className="w-fit bg-brand hover:bg-brand-hover text-white font-semibold px-6 py-3 rounded-lg transition-colors mt-2"
    >
      Join as a Provider
    </Link>
  </div>
</section>
  );
};

export default ProviderCTA;