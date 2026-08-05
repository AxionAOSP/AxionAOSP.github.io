import Link from "next/link";
import TeamConstellation from "@/components/TeamConstellation";
import ContributorsGrid from "./ContributorsGrid";

export const revalidate = 3600;

export type Maintainer = {
  id: string;
  name: string;
  github_username: string;
  devices: string[];
  role?: string;
};

export type Device = {
  codename: string;
  name: string;
  brand: string;
  status: string;
  maintainer_ids: string[];
};

async function getMaintainers() {
  const res = await fetch(
    "https://raw.githubusercontent.com/AxionAOSP/official_devices/main/api/maintainers.json"
  );
  if (!res.ok) throw new Error("Failed to fetch maintainers");
  const data = await res.json();
  return data.maintainers as Maintainer[];
}

async function getDevices() {
  const res = await fetch(
    "https://raw.githubusercontent.com/AxionAOSP/official_devices/main/api/downloads.json"
  );
  if (!res.ok) throw new Error("Failed to fetch devices");
  const data = await res.json();
  return data.devices as Device[];
}

export default async function ContributorsPage() {
  const [allMaintainers, allDevices] = await Promise.all([
    getMaintainers(),
    getDevices(),
  ]);

  const activeDevicesMap: Record<string, { name: string; brand: string }> = {};
  allDevices
    .filter((d) => d.status && d.status.toLowerCase() === "active")
    .forEach((d) => {
      activeDevicesMap[d.codename] = { name: d.name, brand: d.brand };
    });

  const activeMaintainerIds = new Set(
    allDevices
      .filter((d) => d.status && d.status.toLowerCase() === "active")
      .flatMap((d) => d.maintainer_ids)
  );

  const EXCLUDED_KEYS = ["alistergrey", "not-ayan", "jefino9488"];
  
  const deviceMaintainers = allMaintainers.filter(m => 
    activeMaintainerIds.has(m.id) &&
    !EXCLUDED_KEYS.includes(m.id.toLowerCase()) && 
    !EXCLUDED_KEYS.includes(m.github_username.toLowerCase())
  );



  return (
    <main className="min-h-screen bg-[var(--color-axion-bg)] pt-32 pb-24 px-6 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-axion-accent-secondary)] font-medium mb-4">The Architects</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Meet the Team.
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Axion OS is built by a decentralized team of developers, designers, and maintainers dedicated to pushing the boundaries of Android.
          </p>
        </div>

        <TeamConstellation />

        {deviceMaintainers.length > 0 && (
          <section className="text-center mt-24">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Device Maintainers.</h2>
              <p className="text-white/50 font-light max-w-lg mx-auto">The backbone of Axion OS device support.</p>
            </div>
            <ContributorsGrid maintainersList={deviceMaintainers} activeDevicesMap={activeDevicesMap} />
          </section>
        )}
      </div>
    </main>
  );
}
