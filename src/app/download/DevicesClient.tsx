"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

export type Device = {
  codename: string;
  name: string;
  brand: string;
  status: string;
  maintainer_ids: string[];
  support_group?: string;
  images: {
    banner: string;
    fallback: string;
  };
  guide?: string;
  ota?: {
    gms?: string;
    vanilla?: string;
  };
  version?: string | null;
};

export type Maintainer = {
  id: string;
  name: string;
  github_username: string;
};

export default function DevicesClient({
  devices,
  maintainers,
  deviceImages,
}: {
  devices: Device[];
  maintainers: Record<string, Maintainer>;
  deviceImages: Record<string, string>;
}) {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("All");

  const resolveBrand = (device: Device) => {
    return device.brand?.toLowerCase() || "";
  };

  const brands = useMemo(() => {
    const b = new Set(devices.map((d) => resolveBrand(d)));
    return ["All", ...Array.from(b).sort()];
  }, [devices]);

  const filteredDevices = useMemo(() => {
    const list = devices.filter((device) => {
      const matchesSearch =
        device.name.toLowerCase().includes(search.toLowerCase()) ||
        device.codename.toLowerCase().includes(search.toLowerCase());
      const matchesBrand =
        selectedBrand === "All" || resolveBrand(device) === selectedBrand;
      return matchesSearch && matchesBrand;
    });

    return [...list].sort((a, b) => {
      const aActive = a.status?.toLowerCase() === "active";
      const bActive = b.status?.toLowerCase() === "active";
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      return 0;
    });
  }, [devices, search, selectedBrand]);

  return (
    <div className="w-full relative min-h-screen">
      <div className="flex flex-col items-center gap-6 mb-16 relative z-10 w-full">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-1 select-none">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search by name or codename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full bg-white/[0.02] border border-white/5 rounded-full py-4 pl-14 pr-6 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
            />
          </div>
          
          <a
            href="https://cdn.axionos.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white/[0.02] border border-white/5 hover:bg-white/10 hover:border-white/20 rounded-full text-white text-[11px] font-bold uppercase tracking-widest transition-all duration-300 group shrink-0"
          >
            Raw CDN
            <svg className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <div className="flex gap-6 flex-wrap justify-center items-center mt-4">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`pb-2 border-b-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                selectedBrand === brand
                  ? "border-[var(--color-axion-accent)] text-[var(--color-axion-accent)]"
                  : "border-transparent text-white/40 hover:text-white hover:border-white/20"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col w-full relative z-10 pb-32">
        {filteredDevices.length > 0 ? (
          filteredDevices.map((device) => {
            return (
              <Link
                key={device.codename}
                href={`/download/${device.codename}`}
                className="group block border-b border-white/5 last:border-0"
              >
                <article className="py-10 flex flex-col items-start relative overflow-hidden">
                  {device.version && (
                    <div className="absolute top-10 right-4 z-20 text-[10px] font-bold font-mono text-white/20 group-hover:text-[var(--color-axion-accent)] transition-colors select-none">
                      v{device.version}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-1">
                    <span className="text-[var(--color-axion-accent)]/70">{device.brand}</span>
                    <span className="opacity-50 text-[var(--color-axion-accent)]/70">•</span>
                    <span className={
                      device.status?.toLowerCase() === 'active'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }>
                      {device.status}
                    </span>
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-black text-white/70 tracking-tighter group-hover:text-white transition-colors duration-500">
                    {device.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-white/40 mt-3 group-hover:text-white/75 transition-colors">
                    <span>{device.codename}</span>
                    <span>•</span>
                    <span>
                        {device.maintainer_ids.length > 0 
                          ? `By ${device.maintainer_ids.map(id => maintainers[id.toLowerCase()]?.name || id).join(", ")}` 
                          : "Unmaintained"}
                    </span>
                  </div>
                </article>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full py-32 text-center">
            <p className="text-white/30 text-2xl font-bold tracking-tight">No devices match your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
