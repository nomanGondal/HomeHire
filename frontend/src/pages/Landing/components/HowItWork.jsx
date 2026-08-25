const steps = [
  {
    number: "1",
    title: "Choose a service",
    description: "Pick the trade you need in seconds.",
  },
  {
    number: "2",
    title: "Find a trusted professional",
    description: "Compare verified local providers nearby.",
  },
  {
    number: "3",
    title: "Book the service",
    description: "Request a quote and confirm your time.",
  },
  {
    number: "4",
    title: "Get the job done",
    description: "Track progress and review after completion.",
  },
];

const HowItWork = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-20">
      <div className="text-center max-w-xl mx-auto mb-14">
        <h2 className="text-3xl font-bold text-navy tracking-tight">
          How Ustaad Works
        </h2>
        <p className="text-slate mt-2">
          A simple booking flow designed for speed and trust.
        </p>
      </div>

      <div className="relative grid md:grid-cols-4 gap-10 md:gap-6">
        {/* connecting line — desktop only */}
        <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-borderc" />

        {steps.map((step) => (
          <div key={step.number} className="relative flex flex-col items-center text-center gap-3">
            <div className="relative z-10 w-12 h-12 rounded-full bg-brand text-white font-semibold flex items-center justify-center">
              {step.number}
            </div>
            <h3 className="font-semibold text-navy text-base">{step.title}</h3>
            <p className="text-slate text-sm leading-relaxed max-w-[220px]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWork;