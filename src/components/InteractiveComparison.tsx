"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function InteractiveComparison() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => { if (isDragging.current) handleMove(e.clientX); };
    const onTouchMove = (e: TouchEvent) => { if (isDragging.current) handleMove(e.touches[0].clientX); };
    const onUp = () => { isDragging.current = false; };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 70%" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 md:py-48 px-6 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-axion-accent)] font-medium mb-4">Themes</p>
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">Dark and Light.</h2>
          <p className="mt-4 text-xl text-[var(--color-axion-text-secondary)]">Drag to compare beautiful light and dark variants.</p>
        </div>

        <div
          ref={containerRef}
          className="relative w-full max-w-2xl mx-auto aspect-[9/19] rounded-[2rem] overflow-hidden cursor-ew-resize border-2 border-white/10"
          style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}
          onMouseDown={(e) => { handleMouseDown(); handleMove(e.clientX); }}
          onTouchStart={(e) => { isDragging.current = true; handleMove(e.touches[0].clientX); }}
        >
          {/* Before (Light Theme) */}
          <div className="absolute inset-0">
            <Image src="/assets/qs_light_theme.webp" alt="Axion OS light theme quick settings" fill className="object-cover object-top" />
            <div className="absolute top-6 left-6 z-10">
              <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs text-white/70 font-medium uppercase tracking-widest">Light</span>
            </div>
          </div>

          {/* After (Dark Theme) */}
          <div className="absolute inset-0 z-20 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
            <Image src="/assets/qs_purple_theme.webp" alt="Axion OS dark theme quick settings" fill className="object-cover object-top" />
            <div className="absolute top-6 right-6 z-10">
              <span className="px-3 py-1 rounded-full bg-[var(--color-axion-accent)]/30 backdrop-blur-sm text-xs text-white font-bold uppercase tracking-widest">Dark</span>
            </div>
          </div>

          {/* Slider */}
          <div className="absolute top-0 bottom-0 w-[2px] bg-white/80 z-30" style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-panel-heavy flex items-center justify-center border-2 border-white/30 shadow-2xl">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L3 10L7 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 4L17 10L13 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
