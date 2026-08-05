"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const basePath = process.env.NODE_ENV === 'production' ? '/axion' : '';

const clockStyles = [
  { src: `${basePath}/assets/clock1.webp`, name: "Analog", desc: "Minimalist precision tick marks" },
  { src: `${basePath}/assets/clock2.webp`, name: "Modern Flip", desc: "Retro typography display" },
  { src: `${basePath}/assets/clock3.webp`, name: "Bold Numeric", desc: "Ultra-heavy weight display" },
  { src: `${basePath}/assets/clock4.webp`, name: "Dot Matrix", desc: "Nothing-inspired dotted aesthetic" },
  { src: `${basePath}/assets/clock5.webp`, name: "Stencil", desc: "Industrial outline font" },
];

const depthWallpapers = [
  { src: `${basePath}/assets/depth1.webp`, title: "Air Jordan 3D", tag: "Sports" },
  { src: `${basePath}/assets/depth2.webp`, title: "London Mist", tag: "Urban" },
  { src: `${basePath}/assets/depth3.webp`, title: "Burj Horizon", tag: "Architecture" },
  { src: `${basePath}/assets/depth4.webp`, title: "Porsche 911", tag: "Automotive" },
  { src: `${basePath}/assets/depth5.webp`, title: "Tower of Pisa", tag: "Landmark" },
];

export default function HeroSceneMobile() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in hero text
      gsap.fromTo(".mobile-hero-text", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2 }
      );

      // Fade up elements on scroll
      const fadeElements = gsap.utils.toArray(".fade-up");
      fadeElements.forEach((el: any) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-[#0a0706] text-white overflow-hidden">
      {/* 1. Hero Entry */}
      <section className="relative min-h-[90svh] w-full flex flex-col items-center justify-between pt-[15vh] px-6">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] bg-[var(--color-axion-accent)]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col items-center text-center relative z-20 mb-12">
          <h1 className="mobile-hero-text text-6xl sm:text-7xl font-bold tracking-tighter leading-[0.85] mb-4 text-white">
            AXION <span className="text-gradient">OS</span>
          </h1>
          <p className="mobile-hero-text text-lg text-[var(--color-axion-text-secondary)] font-medium">
            The Next Evolution.
          </p>
        </div>

        {/* Hero Phone */}
        <div className="mobile-hero-text relative w-[260px] sm:w-[280px] aspect-[9/20.5] rounded-[2rem] border-[4px] border-[#1a1a1a] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-black shrink-0 translate-y-12">
          <Image
            src={`${basePath}/assets/hero_main.webp`}
            alt="Axion OS Lockscreen"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top filter brightness-[0.95]"
            priority
          />
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-40" />
        </div>
      </section>

      {/* 2. Lockscreen Customization */}
      <section className="py-24 flex flex-col items-center relative">
        <div className="text-center mb-12 px-6 fade-up relative z-20">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 leading-tight">LOCKSCREEN<br/>CUSTOMIZATION</h2>
          <p className="text-[var(--color-axion-text-secondary)]">Your first impression.</p>
        </div>

        {/* Horizontal scroll of clocks on phones */}
        <div className="w-full overflow-x-auto pb-8 snap-x snap-mandatory flex gap-6 px-6 hide-scrollbar fade-up relative z-20">
          {clockStyles.map((clock, i) => (
            <div key={i} className="snap-center shrink-0 flex flex-col items-center gap-6">
              <div className="relative w-[240px] sm:w-[260px] aspect-[9/20.5] rounded-[2rem] border-[3px] border-[#1a1a1a] overflow-hidden shadow-2xl bg-black">
                <Image src={`${basePath}/assets/lockscreen_blank.webp`} alt="bg" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-top brightness-[0.6]" />
                <div className="absolute inset-x-0 top-[8%] h-[28%] flex items-center justify-center z-10 px-8">
                  <Image src={clock.src} alt={clock.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain drop-shadow-xl" />
                </div>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-40" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-[var(--color-axion-accent)]">{clock.name}</h3>
                <p className="text-sm text-white/60">{clock.desc}</p>
              </div>
            </div>
          ))}
          <div className="shrink-0 w-2" /> {/* Right padding for scroll container */}
        </div>
      </section>

      {/* 3. Depth Effect */}
      <section className="py-24 flex flex-col items-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150vw] h-[300px] bg-[var(--color-axion-accent)]/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="text-center mb-12 px-6 fade-up relative z-20">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 text-gradient">DEPTH EFFECT</h2>
          <p className="text-[var(--color-axion-text-secondary)]">Subject, meet clock.</p>
        </div>

        {/* Horizontal scroll of depth wallpapers */}
        <div className="w-full overflow-x-auto pb-8 snap-x snap-mandatory flex gap-6 px-6 hide-scrollbar fade-up relative z-20">
          {depthWallpapers.map((wp, i) => (
            <div key={i} className="snap-center shrink-0 relative w-[240px] sm:w-[260px] aspect-[9/20.5] rounded-[2rem] border-[3px] border-white/10 overflow-hidden shadow-2xl bg-black">
              <Image src={wp.src} alt={wp.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-top" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 to-transparent z-10 flex flex-col justify-end p-4">
                <span className="text-[10px] uppercase tracking-widest text-[var(--color-axion-accent)] font-semibold truncate">{wp.tag}</span>
                <div className="text-sm font-bold text-white truncate">{wp.title}</div>
              </div>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-40" />
            </div>
          ))}
          <div className="shrink-0 w-2" /> {/* Right padding for scroll container */}
        </div>
      </section>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
