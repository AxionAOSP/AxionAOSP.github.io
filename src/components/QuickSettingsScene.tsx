"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function QuickSettingsScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48 px-6 w-full overflow-hidden">
      <div className="max-w-6xl mx-auto mb-20 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-axion-accent)] font-medium mb-4">Quick Settings</p>
        <h2 className="text-5xl md:text-8xl font-bold tracking-tight text-white">
          Total control.
        </h2>
        <p className="mt-6 text-xl text-[var(--color-axion-text-secondary)] max-w-2xl mx-auto">
          Redesigned from the ground up. Customizable grid layouts, draggable tiles, brightness and volume controls — all themed to match your wallpaper.
        </p>
      </div>

      <div ref={cardsRef} className="max-w-6xl mx-auto">
        {/* Two themes side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Amber Theme */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-[var(--color-axion-accent)]" />
              <span className="text-sm text-[var(--color-axion-accent)] font-medium uppercase tracking-widest">Amber Theme</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden">
                <Image src="/assets/qs_expanded_amber.webp" alt="Quick settings expanded amber" fill className="object-cover object-top" />
              </div>
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden">
                <Image src="/assets/qs_customization_amber.webp" alt="Quick settings customization amber" fill className="object-cover object-top" />
              </div>
            </div>
          </div>

          {/* Purple Theme */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-purple-400" />
              <span className="text-sm text-purple-300 font-medium uppercase tracking-widest">Purple Theme</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden">
                <Image src="/assets/qs_purple_theme.webp" alt="Quick settings purple theme" fill className="object-cover object-top" />
              </div>
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden">
                <Image src="/assets/qs_purple_customization.webp" alt="Quick settings purple customization" fill className="object-cover object-top" />
              </div>
            </div>
          </div>
        </div>

        {/* Customization details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-2xl p-8 text-center group hover:border-[var(--color-axion-accent)]/20 transition-all duration-500">
            <div className="text-5xl font-bold text-gradient mb-3">4×4</div>
            <p className="text-sm text-[var(--color-axion-text-secondary)]">Configurable grid columns and rows</p>
          </div>
          <div className="glass-panel rounded-2xl p-8 text-center group hover:border-[var(--color-axion-accent)]/20 transition-all duration-500">
            <div className="text-5xl font-bold text-gradient mb-3">∞</div>
            <p className="text-sm text-[var(--color-axion-text-secondary)]">Unlimited tile arrangements</p>
          </div>
          <div className="glass-panel rounded-2xl p-8 text-center group hover:border-[var(--color-axion-accent)]/20 transition-all duration-500">
            <div className="text-5xl font-bold text-gradient mb-3">2</div>
            <p className="text-sm text-[var(--color-axion-text-secondary)]">Panel layouts: Together or Separate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
