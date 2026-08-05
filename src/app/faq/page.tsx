import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Axion OS",
  description: "Frequently Asked Questions about Axion OS.",
};

export default function FAQPage() {
  const faqs = [
    {
      q: "Why is Axion OS a performance-oriented ROM?",
      a: "Axion OS incorporates various performance optimizations from ProtonAOSP, along with our own custom efficiency tweaks, to deliver a highly reactive, butter-smooth interface."
    },
    {
      q: "Can you add Feature XX?",
      a: "We do not add bloated features from other projects. That said, contributors are welcome to submit original features that align with Axion OS's goals and design direction. Feature requests are also welcome when they include a clear explanation of the idea and its purpose."
    },
    {
      q: "Is battery life good on Axion OS?",
      a: "Battery life depends on factors like kernel, usage, and configuration. Axion OS includes highly proactive efficiency optimizations designed to reduce background resource allocation."
    },
    {
      q: "Does Play Integrity pass?",
      a: (
        <span>
          Check{" "}
          <a
            href="https://github.com/AxionAOSP/PlayIntegrityFix/blob/lineage-22.1/keybox/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-axion-accent)] hover:underline font-semibold"
          >
            this guide
          </a>{" "}
          for detailed instructions.
        </span>
      )
    },
    {
      q: "Where are the customizations?",
      a: "Axion OS prioritizes performance over heavy customization, focusing on core aesthetics (like custom lockscreen clocks, theme stores, and adaptive palettes) to keep the UI native and fast."
    },
    {
      q: "How do I install Axion OS?",
      a: "Follow the detailed installation guide provided on each device's download page."
    }
  ];

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-axion-accent)]/10 blur-[150px] rounded-full pointer-events-none" />

      <section className="max-w-4xl mx-auto relative z-10 select-none">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-axion-accent)] font-medium mb-4">Support Grid</p>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">FAQ.</h1>
          <p className="text-base text-white/60 max-w-2xl mx-auto mt-4 leading-relaxed">
            Find answers to the most common questions about Axion OS, its features, and its goals.
          </p>
        </div>
        
        <div className="space-y-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.5)] p-8 md:p-12">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group border-b border-white/5 py-6 last:border-0">
              <summary className="flex justify-between items-center text-left text-lg md:text-xl font-medium text-white/70 hover:text-white cursor-pointer select-none transition-colors duration-300">
                <span>{faq.q}</span>
                <span className="relative flex items-center justify-center w-6 h-6 ml-4">
                  <span className="absolute w-4 h-[2px] bg-white/40 group-open:rotate-90 group-open:bg-[var(--color-axion-accent)] transition-all duration-300" />
                  <span className="absolute w-[2px] h-4 bg-white/40 group-open:opacity-0 group-open:bg-[var(--color-axion-accent)] transition-all duration-300" />
                </span>
              </summary>
              <div className="mt-4 text-white/40 font-light leading-relaxed text-sm md:text-base max-w-4xl transition-all duration-300">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
