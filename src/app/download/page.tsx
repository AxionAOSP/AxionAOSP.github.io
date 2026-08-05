import DevicesClient, { Device, Maintainer } from "./DevicesClient";

export const revalidate = 3600;

async function getDevices() {
  const res = await fetch(
    "https://raw.githubusercontent.com/AxionAOSP/official_devices/main/api/downloads.json"
  );
  if (!res.ok) throw new Error("Failed to fetch devices");
  const data = await res.json();
  return data.devices as Device[];
}

async function getMaintainers() {
  const res = await fetch(
    "https://raw.githubusercontent.com/AxionAOSP/official_devices/main/api/maintainers.json"
  );
  if (!res.ok) throw new Error("Failed to fetch maintainers");
  const data = await res.json();
  
  const maintainersMap: Record<string, Maintainer> = {};
  data.maintainers.forEach((m: Maintainer) => {
    maintainersMap[m.id.toLowerCase()] = m;
  });
  
  return maintainersMap;
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

async function fetchLatestVersion(otaUrl: string): Promise<string | null> {
  try {
    const res = await fetch(otaUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const builds = data.response || [];
    if (builds.length === 0) return null;
    const latestBuild = builds.sort((a: any, b: any) => b.datetime - a.datetime)[0];
    return latestBuild?.version || null;
  } catch {
    return null;
  }
}

export default async function DevicesPage() {
  const [rawDevices, maintainers, deviceImages] = await Promise.all([
    getDevices(),
    getMaintainers(),
    getDeviceImages(),
  ]);

  const devices = await Promise.all(
    rawDevices.map(async (device) => {
      if (device.status?.toLowerCase() === "active" && device.ota) {
        const otaUrl = device.ota.gms || device.ota.vanilla;
        if (otaUrl) {
          const version = await fetchLatestVersion(otaUrl);
          return { ...device, version };
        }
      }
      return { ...device, version: null };
    })
  );

  return (
    <main className="min-h-screen bg-[var(--color-axion-bg)] pt-24 pb-12 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-axion-accent)]/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-axion-accent)] font-medium mb-2">Downloads</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Find your device.
          </h1>
          <p className="text-sm md:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
            Browse our list of officially supported devices. Maintained by the community, built for performance.
          </p>
        </div>



        <DevicesClient devices={devices} maintainers={maintainers} deviceImages={deviceImages} />

      </div>
    </main>
  );
}
