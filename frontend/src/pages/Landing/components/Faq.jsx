import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Do I need to know my exact address?",
    answer:
      "No. You can share your general area or drop a location pin, and the provider will confirm exact details with you before arriving.",
  },
  {
    question: "Can I pay cash?",
    answer:
      "Yes, cash payment is supported for all bookings. Digital payment options will be added in the future.",
  },
  {
    question: "How are providers verified?",
    answer:
      "Providers go through phone verification and identity checks before they can accept jobs, and build further trust through completed jobs and customer reviews.",
  },
  {
    question: "Can I request a quotation first?",
    answer:
      "Yes. You can describe your issue and request a quote before confirming a booking, so there are no surprises on price.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-navy tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate mt-2">
            Common questions from customers in Pakistan.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-borderc border-t border-b border-borderc">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question}>
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-medium text-navy text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-slate shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <p className="text-slate text-sm leading-relaxed pb-5 pr-8">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;