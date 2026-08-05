"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const basePath = '';

const clockStyles = [
  { src: `${basePath}/assets/clock1.webp`, name: "Analog", desc: "Minimalist precision tick marks" },
  { src: `${basePath}/assets/clock2.webp`, name: "Modern Flip", desc: "Retro typography display" },
  { src: `${basePath}/assets/clock3.webp`, name: "Bold Numeric", desc: "Ultra-heavy weight display" },
  { src: `${basePath}/assets/clock4.webp`, name: "Dot Matrix", desc: "Nothing-inspired dotted aesthetic" },
  { src: `${basePath}/assets/clock5.webp`, name: "Stencil", desc: "Industrial outline font" },
];

const floatingClockStyles = [
  clockStyles[0], clockStyles[1], clockStyles[2], clockStyles[3],
  clockStyles[4], clockStyles[0], clockStyles[1], clockStyles[2]
];

const floatingPositions = [
  // Left side staggered grid (outer column shifted up, inner column shifted down)
  { x: "-36vw", y: "-23vh", rotation: 0 },
  { x: "-21vw", y: "-13vh", rotation: 0 },
  { x: "-36vw", y: "13vh", rotation: 0 },
  { x: "-21vw", y: "23vh", rotation: 0 },
  
  // Right side staggered grid (inner column shifted down, outer column shifted up)
  { x: "21vw", y: "-13vh", rotation: 0 },
  { x: "36vw", y: "-23vh", rotation: 0 },
  { x: "21vw", y: "23vh", rotation: 0 },
  { x: "36vw", y: "13vh", rotation: 0 }
];

const depthWallpapers = [
  { src: `${basePath}/assets/depth1.webp`, title: "Air Jordan 3D", tag: "Sports" },
  { src: `${basePath}/assets/depth2.webp`, title: "London Mist", tag: "Urban" },
  { src: `${basePath}/assets/depth3.webp`, title: "Burj Horizon", tag: "Architecture" },
  { src: `${basePath}/assets/depth4.webp`, title: "Porsche 911", tag: "Automotive" },
  { src: `${basePath}/assets/depth5.webp`, title: "Tower of Pisa", tag: "Landmark" },
];

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Text references
  const heroTextContainerRef = useRef<HTMLDivElement>(null);
  const heroTextEntryRef = useRef<HTMLDivElement>(null);
  const lockscreenTextRef = useRef<HTMLDivElement>(null);
  const depthTextRef = useRef<HTMLDivElement>(null);
  const clockTextsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Phone references
  const phonesContainerRef = useRef<HTMLDivElement>(null);
  const phoneEntryRef = useRef<HTMLDivElement>(null);
  const mainWallpaperRef = useRef<HTMLImageElement>(null);
  const blankWallpaperRef = useRef<HTMLImageElement>(null);
  const blurOverlayRef = useRef<HTMLDivElement>(null);
  const depthWallpaperRef = useRef<HTMLImageElement>(null);
  
  // Array of clock refs
  const clocksRef = useRef<(HTMLDivElement | null)[]>([]);
  const floatingClocksRef = useRef<(HTMLDivElement | null)[]>([]);
  const burstTextRef = useRef<HTMLDivElement>(null);
  
  // Extra phones refs
  const extraPhone1Ref = useRef<HTMLDivElement>(null);
  const extraPhone2Ref = useRef<HTMLDivElement>(null);
  const extraPhone4Ref = useRef<HTMLDivElement>(null);
  const extraPhone5Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Initial setup
      gsap.set(lockscreenTextRef.current, { opacity: 0, y: 40 });
      gsap.set(depthTextRef.current, { opacity: 0, y: 40 });
      gsap.set(clocksRef.current, { opacity: 0, scale: 0.9 });
      gsap.set(clockTextsRef.current, { opacity: 0, y: 20 });
      gsap.set(depthWallpaperRef.current, { opacity: 0 });
      gsap.set(floatingClocksRef.current, { opacity: 0, scale: 0.2, x: 0, y: "-10vh" });
      gsap.set(burstTextRef.current, { opacity: 0, scale: 0.9, y: 10 });
      
      // Ensure phones container starts at default y: 0 (which is bottom-[-15vh])
      gsap.set(phonesContainerRef.current, { y: 0, scale: 1 });

      gsap.set([extraPhone1Ref.current, extraPhone2Ref.current, extraPhone4Ref.current, extraPhone5Ref.current], { 
        opacity: 0, 
        x: 0,
        scale: 0.9
      });
      
      gsap.set(blurOverlayRef.current, { opacity: 0 });

      // 1. Decoupled Entry animations
      gsap.fromTo(heroTextEntryRef.current, 
        { opacity: 0, y: 40, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out", delay: 0.3 }
      );
      gsap.fromTo(phoneEntryRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.4, ease: "power3.out", delay: 0.5 }
      );

      // 2. The Grand Scroll Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=900%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // ---- STAGE 1: Zoom to Lockscreen ----
      tl.to(heroTextContainerRef.current, { opacity: 0, y: -80, filter: "blur(20px)", duration: 1 }, 0)
        .to(phonesContainerRef.current, {
          y: "-18vh",
          scale: 1.35,
          duration: 1.5,
          ease: "power2.inOut",
        }, 0)
        .to(blankWallpaperRef.current, {
          opacity: 1,
          duration: 1,
        }, 0.5)
        .to(blurOverlayRef.current, {
          opacity: 1,
          duration: 1,
        }, 0.5)
        .to(lockscreenTextRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        }, 0.8)
        // Fade out the main lockscreen text before clock descriptions appear
        .to(lockscreenTextRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.6,
        }, 1.8);

      let currentTime = 2.4;

      // ---- STAGE 2: Handcrafted Clock Styles Showcase ----
      const firstClock = clocksRef.current[0];
      const firstClockText = clockTextsRef.current[0];

      tl.to(firstClock, { opacity: 1, scale: 1, duration: 0.8 }, currentTime)
        .to(firstClockText, { opacity: 1, y: 0, duration: 0.8 }, currentTime);

      currentTime += 1.2;

      for (let i = 1; i < clockStyles.slice(0, 2).length; i++) {
        const prevClock = clocksRef.current[i - 1];
        const prevText = clockTextsRef.current[i - 1];
        const currClock = clocksRef.current[i];
        const currText = clockTextsRef.current[i];

        tl.to([prevClock, prevText], { opacity: 0, duration: 0.6 }, currentTime)
          .to(currClock, { opacity: 1, scale: 1, duration: 0.8 }, currentTime + 0.3)
          .to(currText, { opacity: 1, y: 0, duration: 0.8 }, currentTime + 0.3);

        currentTime += 1.5;
      }

      // Fade out last clock description
      const lastClockText = clockTextsRef.current[1];
      tl.to(lastClockText, { opacity: 0, duration: 0.6 }, currentTime);

      // ---- STAGE 3: Massive Clock Burst / Grid ----
      tl.addLabel("burstStage", currentTime);

      tl.to(lockscreenTextRef.current, { opacity: 0, y: -40, duration: 0.8 }, "burstStage")
        .to(clocksRef.current[1], { opacity: 0, scale: 0.9, duration: 0.8 }, "burstStage")
        .to(phonesContainerRef.current, {
          scale: 1.0,
          y: "0vh",
          duration: 1.5,
          ease: "power2.inOut"
        }, "burstStage");

      floatingClockStyles.forEach((_, i) => {
        const pos = floatingPositions[i];
        const el = floatingClocksRef.current[i];
        
        tl.to(el, {
          opacity: 1,
          scale: 1.0,
          x: pos.x,
          y: pos.y,
          rotation: pos.rotation,
          duration: 1.2,
          ease: "power3.out"
        }, `burstStage+=${i * 0.08}`);
      });

      tl.to(burstTextRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.0,
        ease: "power2.out"
      }, "burstStage+=0.5");

      currentTime += 2.5;

      // ---- Transition out of STAGE 3 ----
      tl.addLabel("zoomOut", currentTime);

      tl.to(burstTextRef.current, { opacity: 0, y: -20, duration: 0.8 }, "zoomOut");

      floatingClockStyles.forEach((_, i) => {
        const el = floatingClocksRef.current[i];
        tl.to(el, {
          opacity: 0,
          scale: 0.8,
          x: i % 2 === 0 ? "-=10vw" : "+=10vw",
          duration: 1.0,
          ease: "power2.inOut"
        }, "zoomOut");
      });
      
      currentTime += 1.5;

      // ---- STAGE 4: Split to Depth Wallpapers ----
      tl.addLabel("stage4", currentTime);

      tl.to(depthTextRef.current, { opacity: 1, y: 0, duration: 0.8 }, "stage4")
        .to(depthWallpaperRef.current, { opacity: 1, duration: 1 }, "stage4")
        .to(extraPhone1Ref.current, { opacity: 1, x: "-22vw", y: "30px", scale: 0.88, rotation: -6, duration: 1.5, ease: "power3.out" }, "stage4")
        .to(extraPhone2Ref.current, { opacity: 1, x: "-11vw", y: "15px", scale: 0.94, rotation: -3, duration: 1.5, ease: "power3.out" }, "stage4")
        .to(extraPhone4Ref.current, { opacity: 1, x: "11vw", y: "15px", scale: 0.94, rotation: 3, duration: 1.5, ease: "power3.out" }, "stage4")
        .to(extraPhone5Ref.current, { opacity: 1, x: "22vw", y: "30px", scale: 0.88, rotation: 6, duration: 1.5, ease: "power3.out" }, "stage4");
        
      tl.to({}, { duration: 1.5 });
    });

    return () => mm.revert();
  }, []);

  // Helper for extra phones (Depth Wallpapers)
  const DepthPhone = ({ wp, innerRef, className = "" }: { wp: any, innerRef: React.Ref<HTMLDivElement>, className?: string }) => (
    <div ref={innerRef} className={`absolute bottom-0 w-[220px] md:w-[260px] lg:w-[320px] aspect-[9/20.5] rounded-[2.2rem] border-[3px] border-white/10 overflow-hidden shadow-2xl bg-black will-change-transform ${className}`}>
      <Image src={wp.src} alt={wp.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover object-top" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 to-transparent z-10 flex flex-col justify-end p-4">
        <span className="text-[10px] uppercase tracking-widest text-[var(--color-axion-accent)] font-semibold truncate">{wp.tag}</span>
        <div className="text-sm font-bold text-white truncate">{wp.title}</div>
      </div>
      {/* Notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-40" />
    </div>
  );

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden text-white flex flex-col justify-center items-center">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] md:w-[900px] md:h-[900px] bg-[var(--color-axion-accent)] opacity-[0.08] blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120vw] h-[80vw] md:w-[600px] md:h-[400px] bg-[var(--color-axion-accent-secondary)] opacity-[0.06] blur-[130px] rounded-full pointer-events-none" />

      {/* Main Titles */}
      <div className="absolute top-[20vh] lg:top-[24vh] inset-x-0 z-40 flex flex-col items-center justify-center pointer-events-none">
        
        {/* Stage 0 Text (Decoupled refs to fix scroll reverse bug) */}
        <div ref={heroTextContainerRef} className="absolute flex flex-col items-center text-center">
          <div ref={heroTextEntryRef} className="flex flex-col items-center text-center">
            <h1 className="text-6xl md:text-7xl lg:text-[8rem] font-bold tracking-[-0.02em] leading-[0.85] mb-4 md:mb-6 text-white whitespace-nowrap">
              AXION <span className="text-gradient">OS</span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--color-axion-text-secondary)] font-medium text-center">
              The Next Evolution.
            </p>
          </div>
        </div>

        {/* Stage 1 Text */}
        <div ref={lockscreenTextRef} className="absolute flex flex-col items-center text-center mt-[12vh] lg:mt-[15vh]">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 whitespace-nowrap">
            LOCKSCREEN CUSTOMIZATION
          </h2>
          <p className="text-xl text-[var(--color-axion-text-secondary)]">Your first impression.</p>
        </div>

        {/* Stage 4 Text */}
        <div ref={depthTextRef} className="absolute flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 whitespace-nowrap text-gradient">
            DEPTH EFFECT
          </h2>
          <p className="text-xl text-[var(--color-axion-text-secondary)]">Subject, meet clock.</p>
        </div>
      </div>

      {/* Dynamic Clock Descriptions - Adjusted to bottom-[15vh] */}
      <div className="absolute bottom-[10vh] lg:bottom-[15vh] inset-x-0 z-40 flex justify-center pointer-events-none">
        {clockStyles.slice(0, 2).map((clock, i) => (
          <div key={i} ref={(el) => { clockTextsRef.current[i] = el; }} className="absolute flex flex-col items-center text-center">
            <h3 className="text-3xl font-bold text-[var(--color-axion-accent)] mb-2 tracking-wide">{clock.name}</h3>
            <p className="text-lg text-white/80">{clock.desc}</p>
          </div>
        ))}
      </div>

      {/* Floating Watch Faces Container */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-20">
        {floatingClockStyles.map((clock, i) => (
          <div 
            key={i} 
            ref={(el) => { floatingClocksRef.current[i] = el; }}
            className="absolute w-28 h-32 md:w-36 md:h-44 bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/15 flex flex-col items-center justify-between p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-colors duration-300"
          >
             <div className="relative w-full h-full my-1">
                <Image src={clock.src} alt={clock.name} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-contain drop-shadow-lg" />
             </div>
             <span className="font-mono text-[9px] md:text-[11px] text-white/80 font-medium uppercase tracking-[0.2em]">{clock.name}</span>
          </div>
        ))}
      </div>

      {/* The Phones Container - ANCHORED TO BOTTOM */}
      <div ref={phonesContainerRef} className="absolute inset-x-0 bottom-[-15vh] flex justify-center items-end pointer-events-none z-30">
        
        <DepthPhone wp={depthWallpapers[0]} innerRef={extraPhone1Ref} className="opacity-0" />
        <DepthPhone wp={depthWallpapers[1]} innerRef={extraPhone2Ref} className="opacity-0" />
        <DepthPhone wp={depthWallpapers[3]} innerRef={extraPhone4Ref} className="opacity-0" />
        <DepthPhone wp={depthWallpapers[4]} innerRef={extraPhone5Ref} className="opacity-0" />

        {/* Main Phone */}
        <div ref={phoneEntryRef} className="relative w-[220px] md:w-[260px] lg:w-[320px] aspect-[9/20.5] rounded-[2.2rem] border-[4px] border-[#1a1a1a] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)] bg-black z-20 will-change-transform">
          
          {/* Default Clean Wallpaper */}
          <Image
            src={`${basePath}/assets/hero_main.webp`}
            alt="Axion OS Lockscreen"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top filter brightness-[0.95]"
            priority
          />
          
          {/* Blank Wallpaper for Clocks */}
          <Image
            ref={blankWallpaperRef}
            src={`${basePath}/assets/lockscreen_blank.webp`}
            alt="Axion OS Blank Lockscreen"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top filter brightness-[0.95] opacity-0"
          />
          
          {/* Smooth Blur Overlay instead of animating filter */}
          <div ref={blurOverlayRef} className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[5] pointer-events-none opacity-0" />
          
          {/* Sequential Clock Overlays - strictly contained to top 30% */}
          <div className="absolute top-[8%] inset-x-0 h-[28%] flex items-center justify-center z-10 pointer-events-none">
            {clockStyles.slice(0, 2).map((clock, i) => (
              <div 
                key={i} 
                ref={(el) => { clocksRef.current[i] = el; }}
                className="absolute inset-0 flex items-center justify-center px-10"
              >
                <Image src={clock.src} alt={clock.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain drop-shadow-2xl" />
              </div>
            ))}
          </div>

          {/* Burst Out Central Text - Fills the phone when clocks fan out */}
          <div ref={burstTextRef} className="absolute inset-x-0 top-[20%] flex flex-col items-center justify-center z-20 pointer-events-none px-6">
            <h3 className="text-[2.5rem] font-bold text-white text-center leading-[1.1] tracking-tight">
              Match <br /> Your Vibe.
            </h3>
            <p className="text-sm text-white/70 mt-3 text-center font-medium">
              Dozens of handcrafted styles to choose from.
            </p>
          </div>

          {/* Depth Wallpaper (fades in on top of everything at Stage 4) */}
          <div ref={depthWallpaperRef} className="absolute inset-0 z-30 opacity-0">
            <Image
              src={depthWallpapers[2].src} // Burj Horizon
              alt="Depth Center"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top"
            />
            {/* Text label for the center phone to match the others */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 to-transparent z-10 flex flex-col justify-end p-4">
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-axion-accent)] font-semibold truncate">{depthWallpapers[2].tag}</span>
              <div className="text-sm font-bold text-white truncate">{depthWallpapers[2].title}</div>
            </div>
          </div>

          {/* Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-40" />
        </div>

      </div>
    </section>
  );
}

