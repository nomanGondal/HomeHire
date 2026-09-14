import { Link } from "react-router-dom";

const links = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Terms", to: "/terms" },
  { label: "Privacy", to: "/privacy" },
  { label: "Help", to: "/help" },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-borderc">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-slate text-sm text-center sm:text-left">
          © 2026 Homehire. Trusted local home services.
        </p>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-slate hover:text-brand text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;