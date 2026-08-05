"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface CoreMember {
  name: string;
  displayName: string;
  github: string;
  role: string;
  speed: number;
  sizeClass: string;
  posClass: string;
  cardSide: "left" | "right";
  zClass: string;
}

const CORE_MEMBERS: CoreMember[] = [
  {
    name: "rmp22",
    displayName: "RMP",
    github: "rmp22",
    role: "Project Founder / Developer",
    speed: 0.9,
    sizeClass: "w-[180px] h-[180px] md:w-[320px] md:h-[320px]",
    posClass: "top-[15%] left-[50%]",
    cardSide: "right",
    zClass: "z-50",
  },
  {
    name: "saikrishna",
    displayName: "Sai Krishna",
    github: "Saikrishna1504",
    role: "Project Manager / Core Member",
    speed: 1.2,
    sizeClass: "w-[140px] h-[140px] md:w-[240px] md:h-[240px]",
    posClass: "top-[38%] left-[24%] md:left-[22%]",
    cardSide: "left",
    zClass: "z-40",
  },
  {
    name: "manidweep",
    displayName: "Manidweep",
    github: "manidweep",
    role: "Project Administrator",
    speed: 1.1,
    sizeClass: "w-[140px] h-[140px] md:w-[240px] md:h-[240px]",
    posClass: "top-[38%] left-[76%] md:left-[78%]",
    cardSide: "right",
    zClass: "z-30",
  },
  {
    name: "AlisterGrey",
    displayName: "AlisterGrey",
    github: "AlisterGrey",
    role: "Lead Designer",
    speed: 0.8,
    sizeClass: "w-[120px] h-[120px] md:w-[200px] md:h-[200px]",
    posClass: "top-[68%] left-[10%] md:left-[8%]",
    cardSide: "right",
    zClass: "z-20",
  },
  {
    name: "Jefino9488",
    displayName: "Jefino9488",
    github: "Jefino9488",
    role: "Supportive Contributor",
    speed: 0.95,
    sizeClass: "w-[110px] h-[110px] md:w-[180px] md:h-[180px]",
    posClass: "top-[68%] left-[38%] md:left-[36%]",
    cardSide: "right",
    zClass: "z-20",
  },
  {
    name: "not-ayan",
    displayName: "not-ayan",
    github: "not-ayan",
    role: "Axion Bot Maintainer",
    speed: 1.3,
    sizeClass: "w-[120px] h-[120px] md:w-[200px] md:h-[200px]",
    posClass: "top-[68%] left-[62%] md:left-[64%]",
    cardSide: "left",
    zClass: "z-40",
  },
  {
    name: "Rve27",
    displayName: "Rve27",
    github: "Rve27",
    role: "Supportive Contributor",
    speed: 0.9,
    sizeClass: "w-[110px] h-[110px] md:w-[180px] md:h-[180px]",
    posClass: "top-[68%] left-[90%] md:left-[92%]",
    cardSide: "left",
    zClass: "z-20",
  },
];

export default function TeamConstellation() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wraps = containerRef.current?.querySelectorAll(".team-circle-wrap");
      if (wraps && wraps.length > 0) {
        wraps.forEach((wrap) => {
          const speedAttr = wrap.getAttribute("data-speed");
          const speed = speedAttr ? parseFloat(speedAttr) : 1;
          gsap.to(wrap, {
            y: () => -120 * speed,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="team-constellation"
      className="relative w-full min-h-[130vh] md:min-h-[150vh] mt-12 mb-20"
    >


      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-full pointer-events-none">
        {CORE_MEMBERS.map((m) => {
          const isRight = m.cardSide === "right";
          
          return (
            <div
              key={m.github}
              className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group team-circle-wrap hover:z-[60] ${m.posClass} ${m.zClass}`}
              data-speed={m.speed}
            >
              <a
                href={`https://github.com/${m.github}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (activeId !== m.github) {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveId(m.github);
                  } else {
                    setActiveId(null);
                  }
                }}
                className={`relative block rounded-full overflow-hidden bg-[#111] border border-white/5 cursor-pointer hover:border-white/20 transition-all duration-500 transform-gpu ${m.sizeClass}`}
              >
                <Image
                  src={`https://github.com/${m.github}.png?size=400`}
                  alt={m.displayName}
                  fill
                  sizes="(max-width: 768px) 140px, (max-width: 1200px) 240px, 320px"
                  className="object-cover group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  unoptimized
                />
              </a>

              <div
                className={`absolute opacity-0 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-max z-50 group-hover:opacity-100 group-hover:pointer-events-auto
                  top-full left-1/2 -translate-x-1/2 translate-y-[10px] text-center pt-4 group-hover:translate-y-[20px]
                  
                  ${
                    activeId === m.github ? "opacity-100 pointer-events-auto translate-y-[20px]" : ""
                  }
                  
                  ${
                    isRight
                      ? `lg:top-1/2 lg:left-full lg:right-auto lg:-translate-y-1/2 lg:translate-x-[16px] lg:text-left lg:pt-0 lg:pl-6 lg:group-hover:translate-x-[32px] lg:group-hover:translate-y-0 lg:group-hover:-translate-y-1/2 ${
                          activeId === m.github ? "lg:translate-x-[32px] lg:-translate-y-1/2" : ""
                        }`
                      : `lg:top-1/2 lg:left-auto lg:right-full lg:-translate-y-1/2 lg:-translate-x-[16px] lg:text-right lg:pt-0 lg:pr-6 lg:group-hover:-translate-x-[32px] lg:group-hover:translate-y-0 lg:group-hover:-translate-y-1/2 ${
                          activeId === m.github ? "lg:-translate-x-[32px] lg:-translate-y-1/2" : ""
                        }`
                  }
                `}
              >
                <div className="bg-[#0b0c0e]/95 border border-white/10 px-6 py-4 rounded-2xl min-w-[200px]">
                  <h3 className="font-bold text-lg text-white mb-1 tracking-tight">
                    {m.displayName}
                  </h3>
                  <p className="text-white/40 font-mono text-[10px] mb-3">
                    @{m.github}
                  </p>
                  <p className="text-[var(--color-axion-accent-secondary)] text-xs font-semibold uppercase tracking-wider">
                    {m.role}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
