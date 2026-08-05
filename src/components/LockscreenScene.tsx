"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const clockStyles = [
  { id: 1, src: "/assets/clock1.webp", name: "Analog", desc: "Minimalist precision tick marks" },
  { id: 2, src: "/assets/clock2.webp", name: "Modern Flip", desc: "Retro typography display" },
  { id: 3, src: "/assets/clock3.webp", name: "Bold Numeric", desc: "Ultra-heavy weight display" },
  { id: 4, src: "/assets/clock4.webp", name: "Dot Matrix", desc: "Nothing-inspired dotted aesthetic" },
  { id: 5, src: "/assets/clock5.webp", name: "Stencil", desc: "Industrial outline font" },
];

const depthWallpapers = [
  { src: "/assets/depth1.webp", title: "Air Jordan 3D", tag: "Sports" },
  { src: "/assets/depth2.webp", title: "London Mist", tag: "Urban" },
  { src: "/assets/depth3.webp", title: "Burj Horizon", tag: "Architecture" },
  { src: "/assets/depth4.webp", title: "Porsche 911", tag: "Automotive" },
  { src: "/assets/depth5.webp", title: "Tower of Pisa", tag: "Landmark" },
];

export default function LockscreenScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const clockSectionRef = useRef<HTMLDivElement>(null);
  const clockCardsRef = useRef<HTMLDivElement>(null);
  const depthSectionRef = useRef<HTMLDivElement>(null);
  const phonesContainerRef = useRef<HTMLDivElement>(null);

  const [activeClock, setActiveClock] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Clock Section Entrance
      gsap.fromTo(
        ".clock-heading",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: clockSectionRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        ".clock-card-item",
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: clockCardsRef.current,
            start: "top 80%",
          },
        }
      );

      // Depth Wallpaper Entrance
      gsap.fromTo(
        ".depth-heading",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: depthSectionRef.current,
            start: "top 75%",
          },
        }
      );

      // 5-Phone Spawning Fan Animation
      gsap.fromTo(
        ".spawn-phone",
        { 
          opacity: 0, 
          y: 120, 
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          stagger: 0.14,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: phonesContainerRef.current,
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-[var(--color-axion-bg)] text-white relative z-10">
      {/* SECTION 1: LOCKSCREEN CLOCK STYLES */}
      <section ref={clockSectionRef} className="relative py-24 md:py-36 px-6 w-full overflow-hidden">
        {/* Ambient Warm Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[var(--color-axion-accent)]/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="clock-heading text-center mb-16">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[var(--color-axion-accent)] font-semibold mb-3">
              Lockscreen Customization
            </p>
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-4">
              Your first impression.
            </h2>
            <p className="text-base md:text-xl text-[var(--color-axion-text-secondary)] max-w-xl mx-auto">
              Express your style with handcrafted clock faces, customizable widgets, and dynamic font weights.
            </p>
          </div>

          {/* Interactive Clock Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Phone Preview with Blurred Background */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-[220px] md:w-[260px] aspect-[9/19] rounded-[2.2rem] border-2 border-white/15 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.7)] bg-black">
                <Image
                  src="/assets/hero_main.webp"
                  alt="Default Screen"
                  fill
                  className="object-cover object-top filter blur-[6px] brightness-[0.8]"
                />
                
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-30" />

                {/* Active Clock Style Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6">
                  <div className="relative w-full h-[180px] transition-all duration-500 transform hover:scale-105">
                    <Image
                      src={clockStyles[activeClock].src}
                      alt={clockStyles[activeClock].name}
                      fill
                      className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                    />
                  </div>
                  <div className="mt-8 text-center bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <span className="text-xs uppercase tracking-widest text-[var(--color-axion-accent)] font-semibold">
                      {clockStyles[activeClock].name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clock Selection Cards List */}
            <div ref={clockCardsRef} className="lg:col-span-7 space-y-3">
              {clockStyles.map((clock, index) => {
                const isActive = activeClock === index;
                return (
                  <div
                    key={clock.id}
                    onClick={() => setActiveClock(index)}
                    className={`clock-card-item group cursor-pointer p-4 md:p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                      isActive
                        ? "bg-white/10 border-[var(--color-axion-accent)] shadow-[0_0_30px_rgba(232,176,139,0.15)]"
                        : "bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black/60 border border-white/10 flex-shrink-0">
                        <Image src={clock.src} alt={clock.name} fill className="object-cover p-1" />
                      </div>
                      <div>
                        <h4 className={`text-base md:text-lg font-semibold transition-colors ${
                          isActive ? "text-[var(--color-axion-accent)]" : "text-white group-hover:text-white/90"
                        }`}>
                          {clock.name}
                        </h4>
                        <p className="text-xs md:text-sm text-[var(--color-axion-text-secondary)]">
                          {clock.desc}
                        </p>
                      </div>
                    </div>

                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      isActive
                        ? "border-[var(--color-axion-accent)] bg-[var(--color-axion-accent)] text-black"
                        : "border-white/20 group-hover:border-white/40"
                    }`}>
                      {isActive && (
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: DEPTH WALLPAPERS - INDIVIDUAL PHONE SPAWNING (HyperOS Style) */}
      <section ref={depthSectionRef} className="relative py-24 md:py-36 px-6 w-full overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[var(--color-axion-accent-secondary)]/10 blur-[160px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="depth-heading text-center mb-12 md:mb-16">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[var(--color-axion-accent)] font-semibold mb-3">
              Depth Effect Wallpapers
            </p>
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-4">
              Subject, meet clock.
            </h2>
            <p className="text-base md:text-xl text-[var(--color-axion-text-secondary)] max-w-2xl mx-auto">
              AI-driven subject segmentation seamlessly layers your lockscreen clock behind photo subjects in real-time.
            </p>
          </div>

          {/* 5-Phone Row Layout (100% responsive, zero cutoff, zero scrollbar) */}
          <div
            ref={phonesContainerRef}
            className="w-full flex items-end justify-between gap-2 sm:gap-3 md:gap-4 pt-8 pb-12 overflow-hidden"
          >
            {depthWallpapers.map((wp, index) => {
              const isCenter = index === 2;
              const isInner = index === 1 || index === 3;
              
              const flexStyle = "w-[18.5%] max-w-[210px] flex-shrink-0";
              const elevation = isCenter ? "-translate-y-4 md:-translate-y-6 z-30" : isInner ? "-translate-y-2 z-20" : "z-10";

              return (
                <div
                  key={index}
                  className={`spawn-phone ${flexStyle} ${elevation} transition-all duration-500 hover:-translate-y-6 hover:scale-105`}
                >
                  <div className="relative w-full aspect-[9/19] rounded-[1.2rem] sm:rounded-[1.4rem] md:rounded-[1.8rem] border border-white/20 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] bg-black group">
                    <Image
                      src={wp.src}
                      alt={wp.title}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-110 origin-top"
                    />

                    {/* Punchy Phone Notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 sm:w-3 md:w-4 h-2.5 sm:h-3 md:h-4 bg-black rounded-full z-20" />

                    {/* Gradient Overlay for Label */}
                    <div className="absolute inset-x-0 bottom-0 h-20 md:h-24 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 flex flex-col justify-end p-2 sm:p-3 md:p-4 opacity-90 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[var(--color-axion-accent)] font-semibold truncate">
                        {wp.tag}
                      </span>
                      <h5 className="text-[10px] sm:text-xs md:text-sm font-bold text-white truncate">
                        {wp.title}
                      </h5>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
