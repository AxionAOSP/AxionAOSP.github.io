"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const basePath = process.env.NODE_ENV === 'production' ? '/axion' : '';

export default function CustomizationScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Interactive Slider State for Card 2 (Dark vs Light)
  const [sliderPos, setSliderPos] = useState(50); // percentage 0-100
  const isDragging = useRef(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) handleMove(e.clientX);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".bento-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: { trigger: sectionRef.current, start: "top 65%" }
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 md:py-44 px-6 w-full overflow-hidden bg-[var(--color-axion-bg)] text-white">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[var(--color-axion-accent)]/10 blur-[160px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16 text-center relative z-10">
        <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[var(--color-axion-accent)] font-semibold mb-3">
          Customization
        </p>
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
          Made to be yours.
        </h2>
        <p className="text-base md:text-xl text-[var(--color-axion-text-secondary)] max-w-2xl mx-auto">
          Granular control over every surface of your device — from clock typography and launcher scale to seamless dark and light mode adaptation.
        </p>
      </div>

      {/* 2x2 Bento Box Grid */}
      <div ref={gridRef} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* CARD 1: Lockscreen & Clock Glow (Top Left) */}
        <div className="bento-card relative rounded-3xl p-8 md:p-10 border border-white/10 bg-white/[0.03] backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl group hover:border-[var(--color-axion-accent)]/30 transition-all duration-500 min-h-[380px]">
          {/* Top Ambient Glow inside card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-axion-accent)]/15 blur-[80px] rounded-full pointer-events-none group-hover:bg-[var(--color-axion-accent)]/25 transition-colors duration-500" />

          <div>
            <span className="text-xs uppercase tracking-widest text-[var(--color-axion-accent)] font-bold mb-3 block">
              Lockscreen & Clock Glow
            </span>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Always In the <br className="hidden md:block" /> Best Light
            </h3>
            <p className="text-sm md:text-base text-[var(--color-axion-text-secondary)] leading-relaxed max-w-md">
              Say goodbye to rigid OEM lockscreens. Axion OS analyzes your photo wallpapers in real-time, automatically calculating subject depth, studio lighting accents, and custom font weights for an effortless aesthetic.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-white/90">
              <span className="w-2 h-2 rounded-full bg-[var(--color-axion-accent)] animate-pulse" />
              Dynamic Typography
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-white/90">
              AI Subject Depth
            </span>
          </div>
        </div>

        {/* CARD 2: Dark vs Light Interactive Split Slider (Top Right) */}
        <div className="bento-card relative rounded-3xl p-8 md:p-10 border border-white/10 bg-white/[0.03] backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl group hover:border-[var(--color-axion-accent)]/30 transition-all duration-500 min-h-[380px]">
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2 block">
              Live Theme Adaptation
            </span>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Dark Mode + Light Mode
            </h3>
            <p className="text-xs md:text-sm text-[var(--color-axion-text-secondary)] mt-1">
              Drag the slider to compare how Axion OS shifts between dark and light themes.
            </p>
          </div>

          {/* Interactive Image Split Slider Container */}
          <div 
            ref={sliderRef}
            onMouseDown={() => { isDragging.current = true; }}
            onMouseUp={() => { isDragging.current = false; }}
            onMouseLeave={() => { isDragging.current = false; }}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative w-full h-[200px] md:h-[230px] rounded-2xl overflow-hidden border border-white/15 cursor-ew-resize select-none shadow-inner"
          >
            {/* Background: Light Theme Image */}
            <div className="absolute inset-0 w-full h-full bg-white">
              <Image 
                src={`${basePath}/assets/qs_light_theme.webp`}
                alt="Light Theme Preview"
                fill
                className="object-cover object-top"
              />
              <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] uppercase font-bold text-white tracking-widest border border-white/20 z-10">
                Light Mode
              </span>
            </div>

            {/* Foreground: Dark Theme Image clipped by sliderPos */}
            <div 
              className="absolute inset-0 h-full overflow-hidden bg-black"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="absolute top-0 left-0 w-full h-full min-w-[300px] sm:min-w-[400px] md:min-w-[500px]">
                <Image 
                  src={`${basePath}/assets/qs_purple_theme.webp`}
                  alt="Dark Theme Preview"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <span className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] uppercase font-bold text-white tracking-widest border border-white/20 z-10">
                Dark Mode
              </span>
            </div>

            {/* Draggable Divider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] flex items-center justify-center z-30"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg border-2 border-black/20 text-xs font-bold -translate-x-1/2 hover:scale-110 transition-transform">
                ‹ ›
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Launcher & Workspace (Bottom Left) */}
        <div className="bento-card relative rounded-3xl p-8 md:p-10 border border-white/10 bg-white/[0.03] backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl group hover:border-[var(--color-axion-accent)]/30 transition-all duration-500 min-h-[420px]">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-3 block">
              Launcher & Workspace
            </span>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
              Your All-in-One Desktop
            </h3>
            <p className="text-sm md:text-base text-[var(--color-axion-text-secondary)] leading-relaxed">
              Unlock complete control over your home screen. Elevate your experience with icon scale adjustments, custom notification dots, and live background blur radius tuning.
            </p>
          </div>

          {/* Embedded Mockup Emerging from Bottom */}
          <div className="relative w-full h-[200px] mt-6 flex justify-center items-end">
            <div className="relative w-[220px] md:w-[260px] aspect-[9/16] rounded-t-[2.2rem] border-t-2 border-x-2 border-white/20 overflow-hidden shadow-2xl bg-black transform translate-y-6 group-hover:translate-y-2 transition-transform duration-500">
              <Image 
                src={`${basePath}/assets/launcher_scaling.webp`}
                alt="Launcher Tuning Interface"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
            </div>
          </div>
        </div>

        {/* CARD 4: Routines & Automation (Bottom Right) */}
        <div className="bento-card relative rounded-3xl p-8 md:p-10 border border-white/10 bg-white/[0.03] backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl group hover:border-[var(--color-axion-accent)]/30 transition-all duration-500 min-h-[420px]">
          <div>
            <span className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-3 block">
              Smart Automation
            </span>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
              Turn Habits into Workflows
            </h3>
            <p className="text-sm md:text-base text-[var(--color-axion-text-secondary)] leading-relaxed">
              Weave your favorite daily routines together. Create automated triggers for battery saver, audio profiles, or custom actions with export/import backup.
            </p>
          </div>

          {/* Stacked Cards Montage Preview */}
          <div className="relative w-full h-[200px] mt-6 flex justify-center items-center">
            {/* Background Card */}
            <div className="absolute w-[200px] aspect-[9/16] rounded-2xl border border-white/15 overflow-hidden shadow-xl bg-black transform -rotate-6 -translate-x-6 translate-y-2 group-hover:-rotate-12 transition-transform duration-500 opacity-75">
              <Image 
                src={`${basePath}/assets/lockscreen_customization.webp`}
                alt="Power menu glass options"
                fill
                className="object-cover object-top"
              />
            </div>
            {/* Foreground Card */}
            <div className="relative w-[220px] aspect-[9/16] rounded-2xl border border-white/20 overflow-hidden shadow-2xl bg-black transform rotate-3 translate-x-4 group-hover:rotate-6 transition-transform duration-500 z-10">
              <Image 
                src={`${basePath}/assets/routines_1.webp`}
                alt="Routines automation setup"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
