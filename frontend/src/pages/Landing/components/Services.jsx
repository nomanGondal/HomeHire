import { Zap, Droplets, Snowflake, Hammer, Settings2 } from "lucide-react";
import ServiceCard from "../../../components/common/ServiceCard";
import "./Services.css";

const Service = [
  { icon: Zap, title: "Electrician", description: "Wiring, switches, fans" },
  { icon: Droplets, title: "Plumber", description: "Leaks, taps, drainage" },
  { icon: Snowflake, title: "AC Technician", description: "Cooling, gas refill, servicing" },
  { icon: Hammer, title: "Carpenter", description: "Furniture, doors, fittings" },
  { icon: Settings2, title: "Appliance Repair", description: "Fridge, washer, microwave" },
];

const Services = () => {
  return (
    <section className="services-section">
      <div className="services-header">
        <h2>Popular Services</h2>
        <p>Quick access to the most requested home services.</p>
      </div>

      <div className="services-grid">
        {Service.map((service) => (
          <ServiceCard
            key={service.title}
            icon={service.icon}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Services;