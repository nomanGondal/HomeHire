import { ShieldCheck, MapPin, Receipt, Star, CalendarCheck } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified professionals",
    description: "Identity and skill checks for peace of mind.",
  },
  {
    icon: MapPin,
    title: "Local providers",
    description: "Nearby experts who can reach you quickly.",
  },
  {
    icon: Receipt,
    title: "Transparent quotations",
    description: "Clear starting prices and quote requests.",
  },
  {
    icon: Star,
    title: "Ratings & reviews",
    description: "See real feedback before you book.",
  },
  {
    icon: CalendarCheck,
    title: "Easy booking",
    description: "Fast scheduling with cash payment support.",
  },
];

const WhyUstaad = () => {
  return (
    <section className="bg-offwhite">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-20">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-navy tracking-tight">
            Why Ustaad
          </h2>
          <p className="text-slate mt-2">
            Built around trust, transparency, and local convenience.
          </p>
        </div>

       <div className="flex flex-col gap-10 max-w-2xl mx-auto">
  {features.map(({ icon: Icon, title, description }) => (
    <div key={title} className="flex items-start gap-4">
      <div className="shrink-0 w-11 h-11 rounded-xl bg-white border border-borderc text-brand flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="font-semibold text-navy text-base">{title}</h3>
        <p className="text-slate text-sm leading-relaxed mt-1">
          {description}
        </p>
      </div>
    </div>
  ))}
</div>
      </div>
    </section>
  );
};

export default WhyUstaad;