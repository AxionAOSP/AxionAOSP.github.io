"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const basePath = process.env.NODE_ENV === 'production' ? '/axion' : '';



const appDrawerImages = [
  `${basePath}/assets/app_drawer_1.webp`,
  `${basePath}/assets/app_drawer_2.webp`,
];

export default function HomeScreenScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Interactive Slider State for Dark vs Light Card
  const [sliderPos, setSliderPos] = useState(50); // percentage 0-100
  const isDragging = useRef(false);
  const sliderRef = useRef<HTMLDivElement>(null);



  // Auto-scrolling slideshow for Card 4 (App Drawer)
  const [currentAppDrawerSlide, setCurrentAppDrawerSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAppDrawerSlide((prev) => (prev + 1) % appDrawerImages.length);
    }, 3000); // Crossfade every 3 seconds
    return () => clearInterval(timer);
  }, []);

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
      const cards = gridRef.current?.querySelectorAll(".showcase-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 md:py-44 px-6 w-full overflow-hidden bg-[var(--color-axion-bg)] text-white">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] md:w-[1000px] md:h-[600px] bg-[var(--color-axion-accent)]/5 blur-[200px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-32 text-center relative z-10">
        <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[var(--color-axion-accent)] font-semibold mb-4">
          Home Screen
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-4 md:mb-6">
          The ultimate canvas.
        </h2>
        <p className="text-lg md:text-2xl text-[var(--color-axion-text-secondary)] max-w-2xl mx-auto font-light leading-relaxed">
          Granular control over every surface of your device. 
          Tune everything down to the exact percentage.
        </p>
      </div>

      {/* Asymmetrical Staggered Layout */}
      <div ref={gridRef} className="max-w-6xl mx-auto flex flex-row overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-6 md:gap-8 lg:gap-16 relative z-10 items-start hide-scrollbar px-6 md:px-0 -mx-6 md:mx-auto pb-12 md:pb-0 pt-4 md:pt-0">
        
        {/* Column 1 - Shifted Up Slightly */}
        <div className="flex-none md:flex-1 flex flex-col gap-6 md:gap-8 lg:gap-16 w-[85vw] shrink-0 snap-center md:w-full md:shrink md:snap-align-none md:-translate-y-16">
          
          {/* Card 1: Launcher Tuning (Large Image Focus) */}
          <div className="showcase-card relative rounded-[2rem] bg-white/[0.02] border border-white/10 overflow-hidden group">
            <div className="aspect-[4/5] relative w-full overflow-hidden">
              <Image 
                src={`${basePath}/assets/launcher_tuning_4.webp`}
                alt="Grid & Scaling"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-top origin-top group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
              
              {/* Content overlays image */}
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-axion-accent)] font-bold mb-3 block">
                  Grid & Scaling
                </span>
                <h3 className="text-3xl font-medium text-white mb-3">
                  Every Pixel, Tuned
                </h3>
                <p className="text-sm text-white/70 max-w-sm">
                  Adjust wallpaper blur, icon scaling, and layout grids with precise sliders.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Workspace */}
          <div className="showcase-card relative rounded-[2rem] bg-white/[0.02] border border-white/10 overflow-hidden group">
            <div className="p-8 md:p-12 pb-0">
              <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold mb-3 block">
                Workspace
              </span>
              <h3 className="text-3xl font-medium text-white mb-3">
                All-in-One Desktop
              </h3>
              <p className="text-sm text-white/70 max-w-sm mb-10">
                Lock apps, screenshot tasks, and manage memory with intuitive gestures.
              </p>
            </div>
            <div className="relative w-full h-[400px] flex justify-center items-center pb-12">
              {/* Background Phone */}
              <div className="absolute w-[200px] aspect-[9/16] rounded-3xl border border-white/15 overflow-hidden shadow-xl bg-black transform -rotate-6 -translate-x-12 translate-y-4 group-hover:-rotate-12 group-hover:-translate-x-16 transition-all duration-700 ease-out opacity-75">
                <Image 
                  src={`${basePath}/assets/workspace_back.webp`}
                  alt="Workspace Secondary"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top"
                />
              </div>
              
              {/* Foreground Phone */}
              <div className="relative w-[220px] aspect-[9/16] rounded-3xl border border-white/20 overflow-hidden shadow-2xl bg-black transform rotate-3 translate-x-8 group-hover:rotate-6 group-hover:translate-x-12 group-hover:-translate-y-2 transition-all duration-700 ease-out z-10">
                <Image 
                  src={`${basePath}/assets/workspace_front.webp`}
                  alt="Workspace Overview"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Column 2 - Shifted Down Slightly */}
        <div className="flex-none md:flex-1 flex flex-col gap-6 md:gap-8 lg:gap-16 w-[85vw] shrink-0 snap-center md:w-full md:shrink md:snap-align-none md:translate-y-16">
          
          {/* Card 2: Interactive Dark/Light Slider */}
          <div className="showcase-card relative rounded-[2rem] bg-white/[0.02] border border-white/10 overflow-hidden group">
            <div className="p-8 md:p-12">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white font-bold mb-3 block">
                Live Adaptation
              </span>
              <h3 className="text-3xl font-medium text-white mb-3">
                Dark & Light Mode
              </h3>
              <p className="text-sm text-white/70 max-w-sm mb-10">
                Drag to compare how Axion OS elegantly shifts between themes.
              </p>
              
              {/* Interactive Image Split Slider */}
              <div 
                ref={sliderRef}
                onMouseDown={() => { isDragging.current = true; }}
                onMouseUp={() => { isDragging.current = false; }}
                onMouseLeave={() => { isDragging.current = false; }}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                className="@container relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 cursor-ew-resize select-none group/slider"
              >
                {/* Background: Light Theme */}
                <div className="absolute inset-0 w-full h-full bg-white">
                  <Image 
                    src={`${basePath}/assets/theme_light.webp`}
                    alt="Light Theme"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center"
                  />
                  <span className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest text-white border border-white/10 z-10">
                    Light
                  </span>
                </div>

                {/* Foreground: Dark Theme */}
                <div 
                  className="absolute inset-y-0 left-0 overflow-hidden bg-black z-10"
                  style={{ width: `${sliderPos}%` }}
                >
                  <div className="relative w-[100cqw] h-full">
                    <Image 
                      src={`${basePath}/assets/theme_dark.webp`}
                      alt="Dark Theme"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <span className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest text-white border border-white/10 z-10">
                    Dark
                  </span>
                </div>

                {/* Slider Handle */}
                <div 
                  className="absolute top-0 bottom-0 w-[2px] bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-20"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white shadow-lg group-hover/slider:scale-110 transition-transform">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180 -ml-2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: App Drawer */}
          <div className="showcase-card relative rounded-[2rem] bg-white/[0.02] border border-white/10 overflow-hidden group">
            <div className="aspect-[4/3] relative w-full overflow-hidden">
              {appDrawerImages.map((src, i) => (
                <Image 
                  key={i}
                  src={src}
                  alt={`App Drawer ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-cover object-top origin-top group-hover:scale-105 transition-all duration-1000 ease-in-out ${i === currentAppDrawerSlide ? "opacity-90 scale-100" : "opacity-0 scale-105"}`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 z-20 pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full z-30">
                <span className="text-[10px] uppercase tracking-[0.2em] text-purple-400 font-bold mb-3 block">
                  App Drawer
                </span>
                <h3 className="text-3xl font-medium text-white mb-3">
                  Smart Categories
                </h3>
                <p className="text-sm text-white/70 max-w-sm">
                  Automatically organized folders with instantly searchable apps and widgets.
                </p>
              </div>
            </div>
          </div>

          {/* Card 5: Widgets (New Card) */}
          <div className="showcase-card relative rounded-[2rem] bg-white/[0.02] border border-white/10 overflow-hidden group">
            <div className="aspect-[4/5] relative w-full overflow-hidden">
              <Image 
                src={`${basePath}/assets/widgets_panel.webp`}
                alt="Widgets and Panels"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center origin-top group-hover:scale-105 transition-transform duration-700 ease-out opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
              
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mb-3 block">
                  Glanceable Info
                </span>
                <h3 className="text-3xl font-medium text-white mb-3">
                  Widgets & Panels
                </h3>
                <p className="text-sm text-white/70 max-w-sm">
                  Place dynamic widgets anywhere and interact with your apps without opening them.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
