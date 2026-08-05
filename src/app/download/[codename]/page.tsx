import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, Calendar, HardDrive } from "lucide-react";
import { notFound } from "next/navigation";
import DeviceImage from "@/components/DeviceImage";
import DeviceHeaderClient from "./DeviceHeaderClient";

export const revalidate = 3600; // 1 hour cache

type Build = {
  datetime: number;
  filename: string;
  id: string;
  romtype: string;
  size: number;
  url: string;
  version: string;
};

async function getDeviceData(codename: string) {
  const res = await fetch(
    "https://raw.githubusercontent.com/AxionAOSP/official_devices/main/api/downloads.json"
  );
  if (!res.ok) return null;
  const data = await res.json();
  const device = data.devices.find((d: any) => d.codename === codename);
  return device || null;
}

async function fetchBuilds(url: string): Promise<Build[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.response || [];
  } catch {
    return [];
  }
}

async function fetchChangelog(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) return "No changelog available.";
    return await res.text();
  } catch {
    return "No changelog available.";
  }
}

async function fetchGuide(url: string): Promise<string | null> {
  try {
    let rawUrl = url;
    if (url.includes("github.com") && !url.includes("raw.githubusercontent.com")) {
      rawUrl = url
        .replace("github.com", "raw.githubusercontent.com")
        .replace("/blob/", "/");
    }
    const res = await fetch(rawUrl);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function formatSize(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export async function generateStaticParams() {
  try {
    const res = await fetch("https://raw.githubusercontent.com/AxionAOSP/official_devices/main/api/downloads.json");
    if (!res.ok) return [];
    const data = await res.json();
    return data.devices.map((device: any) => ({
      codename: device.codename,
    }));
  } catch (e) {
    return [];
  }
}

async function getDeviceImages() {
  const res = await fetch(
    "https://raw.githubusercontent.com/AxionAOSP/AxionAOSP.github.io/main_bk/device_images.json"
  );
  if (!res.ok) return {};
  const data = await res.json();
  const imagesMap: Record<string, string> = {};
  data.devices.forEach((d: { codename: string; imageUrl: string }) => {
    imagesMap[d.codename] = d.imageUrl;
  });
  return imagesMap;
}

export type Maintainer = {
  id: string;
  name: string;
  github_username: string;
};

async function getMaintainers() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/AxionAOSP/official_devices/main/api/maintainers.json"
    );
    if (!res.ok) return {};
    const data = await res.json();
    const maintainersMap: Record<string, Maintainer> = {};
    data.maintainers.forEach((m: Maintainer) => {
      maintainersMap[m.id.toLowerCase()] = m;
    });
    return maintainersMap;
  } catch {
    return {};
  }
}

export default async function DevicePage({
  params,
}: {
  params: Promise<{ codename: string }>
}) {
  const resolvedParams = await params;
  const device = await getDeviceData(resolvedParams.codename);
  
  if (!device) {
    notFound();
  }

  const [gmsBuilds, vanillaBuilds, changelog, guideText, deviceImages, maintainersMap] = await Promise.all([
    device.ota?.gms ? fetchBuilds(device.ota.gms) : Promise.resolve([]),
    device.ota?.vanilla ? fetchBuilds(device.ota.vanilla) : Promise.resolve([]),
    device.changelog ? fetchChangelog(device.changelog) : Promise.resolve("No changelog found."),
    device.guide ? fetchGuide(device.guide) : Promise.resolve(null),
    getDeviceImages(),
    getMaintainers(),
  ]);

  const imageUrl = deviceImages[device.codename] || device.images?.banner || device.images?.fallback;

  const officialMaintainers = (device.maintainer_ids || [])
    .map((id: string) => maintainersMap[id.toLowerCase()])
    .filter((m: any) => m !== undefined);

  const allBuilds = [...gmsBuilds, ...vanillaBuilds];
  const latestBuild = allBuilds.sort((a, b) => b.datetime - a.datetime)[0];
  const latestVersion = latestBuild?.version || null;

  return (
    <main className="min-h-screen bg-[var(--color-axion-bg)] pt-24 pb-24 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[var(--color-axion-accent)]/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Back Button */}
        <Link 
          href="/download" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group uppercase tracking-widest text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Downloads
        </Link>

        {/* Device Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12 mb-16 relative">
          <div className="flex-1 space-y-4">
            <span className="text-[var(--color-axion-accent)] text-sm font-bold uppercase tracking-[0.2em] mb-1 block">
              {device.brand}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter">
              {device.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-white/50 mt-4">
              <span className="font-mono text-lg">{device.codename}</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className={`uppercase tracking-widest text-xs font-bold ${
                device.status?.toLowerCase() === 'active'
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}>
                {device.status}
              </span>
              {latestVersion && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="text-xs font-bold uppercase tracking-widest font-mono text-[var(--color-axion-accent)] animate-fade-in">
                    v{latestVersion}
                  </span>
                </>
              )}
            </div>

            {officialMaintainers.length > 0 && (
              <div className="pt-4 flex flex-wrap items-center gap-3 text-sm text-white/60 select-none">
                <span className="font-medium text-white/40 text-[10px] uppercase tracking-wider">Maintained by:</span>
                {officialMaintainers.map((m: any, idx: number) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <a
                      href={`https://github.com/${m.github_username || m.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group/maintainer"
                    >
                      <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white/10 bg-black/40">
                        <Image
                          src={`https://github.com/${m.github_username || m.id}.png?size=60`}
                          alt={m.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="text-white font-semibold text-[13px] leading-none group-hover/maintainer:text-[var(--color-axion-accent)] transition-colors">
                        {m.name || m.id}
                      </span>
                    </a>
                    {idx < officialMaintainers.length - 1 && (
                      <span className="text-white/20">•</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <DeviceHeaderClient 
              guideText={guideText} 
              supportGroupUrl={device.support_group} 
            />
          </div>

          <div className="w-36 md:w-48 lg:w-64 aspect-[9/19.5] relative -my-6 md:-my-12 mx-auto md:mx-0 flex-shrink-0">
            <div className="absolute inset-0 bg-[var(--color-axion-accent)]/20 blur-3xl rounded-full" />
            <div className="relative w-full h-full drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <DeviceImage
                sources={[
                  `https://raw.githubusercontent.com/AxionAOSP/official_devices/main/OTA/Banners/devices/${device.codename}.webp`,
                  deviceImages[device.codename],
                  device.images?.banner,
                  device.images?.fallback,
                ]}
                alt={device.name}
                className="object-contain text-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content (Builds) */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* GMS Builds */}
            <section>
              <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                GMS Builds (With Google Apps)
              </h3>
              {gmsBuilds.length > 0 ? (
                <div className="space-y-4">
                  {gmsBuilds.map((build) => (
                    <div key={build.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-white/10 transition-colors">
                      <div className="space-y-2 w-full overflow-hidden">
                        <h4 className="text-base md:text-lg font-bold text-white truncate w-full md:max-w-md" title={build.filename}>{build.filename}</h4>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(build.datetime)}</span>
                          <span className="flex items-center gap-1.5"><HardDrive className="w-4 h-4" /> {formatSize(build.size)}</span>
                          <span className="text-[var(--color-axion-accent)] font-bold text-sm tracking-widest uppercase">v{build.version}</span>
                        </div>
                      </div>
                      <a href={build.url} className="w-full md:w-auto px-8 py-4 bg-[var(--color-axion-accent)] hover:bg-[var(--color-axion-accent-hover)] text-[#100B09] font-bold rounded-xl flex justify-center items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,100,0,0.2)] hover:shadow-[0_0_40px_rgba(255,100,0,0.4)] hover:scale-105">
                        <Download className="w-5 h-5" /> Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 italic bg-white/5 p-6 rounded-3xl border border-white/5">No GMS builds currently available.</p>
              )}
            </section>

            {/* Vanilla Builds */}
            <section>
              <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                Vanilla Builds (Without Google Apps)
              </h3>
              {vanillaBuilds.length > 0 ? (
                <div className="space-y-4">
                  {vanillaBuilds.map((build) => (
                    <div key={build.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-white/10 transition-colors">
                      <div className="space-y-2 w-full overflow-hidden">
                        <h4 className="text-base md:text-lg font-bold text-white truncate w-full md:max-w-md" title={build.filename}>{build.filename}</h4>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(build.datetime)}</span>
                          <span className="flex items-center gap-1.5"><HardDrive className="w-4 h-4" /> {formatSize(build.size)}</span>
                          <span className="text-[var(--color-axion-accent)] font-bold text-sm tracking-widest uppercase">v{build.version}</span>
                        </div>
                      </div>
                      <a href={build.url} className="w-full md:w-auto px-8 py-4 bg-white hover:bg-white/90 text-black font-bold rounded-xl flex justify-center items-center gap-2 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <Download className="w-5 h-5" /> Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 italic bg-white/5 p-6 rounded-3xl border border-white/5">No Vanilla builds currently available.</p>
              )}
            </section>
          </div>

          {/* Sidebar (Changelog) */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 border border-white/10 rounded-[2rem] p-8 flex flex-col max-h-[550px]">
              <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-[var(--color-axion-accent)] shrink-0 select-none">Device Changelog</h3>
              <div className="flex-grow overflow-y-auto pr-2 text-sm text-white/70 whitespace-pre-wrap font-mono leading-relaxed scrollbar-thin" data-lenis-prevent>
                {changelog}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
