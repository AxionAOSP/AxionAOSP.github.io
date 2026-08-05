"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function ThemingShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48 px-6 w-full overflow-hidden">
      {/* Accent glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500 opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-axion-accent)] opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto mb-20 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-axion-accent)] font-medium mb-4">Theming</p>
        <h2 className="text-5xl md:text-8xl font-bold tracking-tight text-white">
          One OS. <br className="hidden md:block" />Every color.
        </h2>
        <p className="mt-6 text-xl text-[var(--color-axion-text-secondary)] max-w-2xl mx-auto">
          Axion OS adapts its entire UI — quick settings, notifications, controls, media player — to match your chosen accent color and wallpaper. Every theme feels native.
        </p>
      </div>

      <div ref={contentRef} className="max-w-6xl mx-auto">
        {/* Side-by-side theme comparison */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Amber QS */}
          <div className="relative aspect-[9/19] rounded-3xl overflow-hidden glass-panel group">
            <Image src="/assets/qs_expanded_amber.webp" alt="Amber themed quick settings" fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105 origin-top" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <span className="text-xs font-bold text-[var(--color-axion-accent)] uppercase tracking-widest">Amber</span>
            </div>
          </div>
          {/* Green QS */}
          <div className="relative aspect-[9/19] rounded-3xl overflow-hidden glass-panel group">
            <Image src="/assets/qs_green_theme.webp" alt="Green themed quick settings" fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105 origin-top" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Teal</span>
            </div>
          </div>
          {/* Purple QS */}
          <div className="relative aspect-[9/19] rounded-3xl overflow-hidden glass-panel group">
            <Image src="/assets/qs_purple_theme.webp" alt="Purple themed quick settings" fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105 origin-top" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Lavender</span>
            </div>
          </div>
          {/* Purple Full */}
          <div className="relative aspect-[9/19] rounded-3xl overflow-hidden glass-panel group">
            <Image src="/assets/qs_purple_full_panel.webp" alt="Purple themed full quick settings panel" fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105 origin-top" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">Violet</span>
            </div>
          </div>
        </div>

        {/* Notification theming */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel rounded-3xl p-6 group">
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden">
              <Image src="/assets/notification_shade_green.webp" alt="Green themed notification shade" fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold text-white">Notification Shade</h3>
              <p className="text-sm text-[var(--color-axion-text-secondary)] mt-1">Smart notifications with app grouping and AxionFx audio processing indicator.</p>
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-6 group">
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden">
              <Image src="/assets/notification_shade_purple.webp" alt="Purple themed notification shade with media player" fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold text-white">Media Integration</h3>
              <p className="text-sm text-[var(--color-axion-text-secondary)] mt-1">Full album art, playback controls, and device routing — all themed.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
