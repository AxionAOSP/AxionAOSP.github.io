import { notFound } from "next/navigation";
import DevicePageClient, { Build, Maintainer, Device } from "./DevicePageClient";

export const revalidate = 3600; // 1 hour cache

async function getDeviceData(codename: string) {
  const res = await fetch(
    "https://raw.githubusercontent.com/AxionAOSP/official_devices/main/api/downloads.json"
  );
  if (!res.ok) return null;
  const data = await res.json();
  const device = data.devices.find((d: Device) => d.codename === codename);
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

export async function generateStaticParams() {
  try {
    const res = await fetch("https://raw.githubusercontent.com/AxionAOSP/official_devices/main/api/downloads.json");
    if (!res.ok) return [];
    const data = await res.json();
    return data.devices.map((device: Device) => ({
      codename: device.codename,
    }));
  } catch {
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

  return (
    <DevicePageClient
      initialDevice={device}
      initialGmsBuilds={gmsBuilds}
      initialVanillaBuilds={vanillaBuilds}
      initialChangelog={changelog}
      initialGuideText={guideText}
      initialDeviceImages={deviceImages}
      initialMaintainersMap={maintainersMap}
      codename={resolvedParams.codename}
    />
  );
}
