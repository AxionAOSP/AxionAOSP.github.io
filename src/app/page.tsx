import HeroScene from "@/components/HeroScene";
import HeroSceneMobile from "@/components/HeroSceneMobile";
import dynamic from "next/dynamic";

const HomeScreenScene = dynamic(() => import("@/components/HomeScreenScene"));
const FeatureShowcase = dynamic(() => import("@/components/FeatureShowcase"));
const ResearchShowcase = dynamic(() => import("@/components/ResearchShowcase"));

export default function Home() {

  return (
    <main className="block w-full min-h-screen overflow-x-hidden relative">

      <div className="hidden md:block">
        <HeroScene />
      </div>
      <div className="block md:hidden">
        <HeroSceneMobile />
      </div>

      <div className="w-full relative z-10">
        <HomeScreenScene />

        <FeatureShowcase />

        <ResearchShowcase />
      </div>
    </main>
  );
}
