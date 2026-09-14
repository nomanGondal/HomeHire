import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Booked an electrician in minutes. The provider was verified, on time, and explained the issue clearly.",
    name: "Ayesha M.",
  },
  {
    quote: "Loved the transparent quotation and the easy chat. It felt local, simple, and trustworthy.",
    name: "Hassan R.",
  },
  {
    quote: "Great for quick AC servicing. I could compare providers and choose the best one for my budget.",
    name: "Sara K.",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-offwhite">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-20">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-navy tracking-tight">
            Customer Testimonials
          </h2>
          <p className="text-slate mt-2">
            What homeowners say after booking through Homehire.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name }) => (
            <div
              key={name}
              className="bg-white border border-borderc rounded-2xl p-6 flex flex-col gap-4"
            >
              <Quote size={22} className="text-brand/30" fill="currentColor" />

              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="text-amber-400" fill="currentColor" />
                ))}
              </div>

              <p className="text-slate text-sm leading-relaxed">
                "{quote}"
              </p>

              <div className="flex items-center gap-3 mt-auto pt-2">
                <div className="w-9 h-9 rounded-full bg-brand/10 text-brand text-sm font-semibold flex items-center justify-center">
                  {name.charAt(0)}
                </div>
                <span className="text-navy text-sm font-medium">{name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;