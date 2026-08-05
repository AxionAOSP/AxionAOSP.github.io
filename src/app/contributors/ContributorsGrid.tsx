"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Maintainer } from "./page";

interface ContributorsGridProps {
  maintainersList: Maintainer[];
  activeDevicesMap: Record<string, { name: string; brand: string }>;
}

export default function ContributorsGrid({
  maintainersList,
  activeDevicesMap,
}: ContributorsGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12 max-w-5xl mx-auto">
      {maintainersList.map((m) => {
        const github = m.github_username || m.id;
        const name = m.name || github;

        const activeDevs = (m.devices || [])
          .filter((codename) => activeDevicesMap[codename])
          .map((codename) => ({
            codename,
            name: activeDevicesMap[codename].name,
            brand: activeDevicesMap[codename].brand,
          }));

        return (
          <div key={m.id} className="relative group block">
            <a
              href={`https://github.com/${github}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (activeId !== github) {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveId(github);
                } else {
                  setActiveId(null);
                }
              }}
              className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-black/50 border border-white/10 group-hover:border-white/30 group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-300 block cursor-pointer"
            >
              <Image
                src={`https://github.com/${github}.png?size=150`}
                alt={name}
                width={80}
                height={80}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                unoptimized
              />
            </a>

            <div
              className={`absolute bottom-full left-1/2 -translate-x-1/2 pb-3 opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-[-8px] translate-y-0 transition-all duration-300 z-50 ${
                activeId === github ? "opacity-100 pointer-events-auto translate-y-[-8px]" : ""
              }`}
            >
              <div className="bg-[#0b0c0e]/95 border border-white/10 px-5 py-4 rounded-2xl shadow-2xl text-center min-w-[220px]">
                <a
                  href={`https://github.com/${github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-axion-accent-secondary)] transition-colors block cursor-pointer group/name"
                >
                  <div className="text-white font-bold text-sm tracking-tight group-hover/name:text-[var(--color-axion-accent-secondary)] transition-colors">
                    {name}
                  </div>
                  <div className="text-white/40 font-mono text-[10px] mt-0.5 mb-2">
                    @{github}
                  </div>
                  {m.role && (
                    <div className="text-[10px] font-bold text-[var(--color-axion-accent)] uppercase tracking-widest mb-3">
                      {m.role}
                    </div>
                  )}
                </a>

                {activeDevs.length > 0 && (
                  <div className="pt-3 border-t border-white/5 text-left">
                    <span className="text-[9px] uppercase tracking-widest text-[var(--color-axion-accent-secondary)] font-bold block mb-2">
                      Active Devices
                    </span>
                    <div
                      className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto pr-1"
                      data-lenis-prevent
                    >
                      {activeDevs.map((dev) => (
                        <Link
                          key={dev.codename}
                          href={`/download/${dev.codename}`}
                          className="flex items-center justify-between gap-3 text-[11px] bg-white/[0.03] border border-white/5 rounded-lg px-2.5 py-1.5 hover:bg-white/[0.08] hover:border-white/15 hover:scale-[1.02] transition-all cursor-pointer block"
                        >
                          <span className="text-white/70 truncate max-w-[100px] font-medium">
                            {dev.name}
                          </span>
                          <span className="font-mono text-white/30 text-[9px] uppercase bg-white/5 px-1.5 py-0.5 rounded">
                            {dev.codename}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
