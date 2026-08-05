"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Layers, Activity, Server } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────────── AXBOOSTFWK VISUAL ───────────────────────── */
function CodeWindow() {
  return (
    <div className="relative w-full max-w-lg aspect-square sm:aspect-[4/3] rounded-2xl bg-[#0d1117] border border-white/10 shadow-2xl overflow-hidden font-mono text-[10px] sm:text-sm text-left flex flex-col group">
      {/* Window Header */}
      <div className="flex items-center px-4 py-3 bg-[#161b22] border-b border-white/5 gap-2">
        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 sm:ml-4 text-white/40 text-[10px] sm:text-xs font-sans">SfCpuPolicy.cpp</span>
      </div>
      {/* Code Content */}
      <div className="p-4 sm:p-5 overflow-hidden flex-1 relative text-gray-300">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-[#0d1117] z-10" />
        <pre className="leading-relaxed">
          <span className="text-purple-400">unsigned int</span> <span className="text-blue-400">computeUclampMin</span>() {"{"}<br/>
          {"    "}
          <span className="text-gray-500">// Per-Hz uclamp floors: 60Hz -{">"} 82, 120Hz -{">"} 106</span><br/>
          {"    "}
          <span className="text-purple-400">unsigned int</span> base = sUclampMinForHz[sHzBucket];<br/><br/>
          {"    "}
          <span className="text-gray-500">// Clamp to [uclampLower=106, uclampUpper=344]</span><br/>
          {"    "}
          base = std::clamp(base, sUclampLower, sUclampUpper);<br/><br/>
          {"    "}
          <span className="text-purple-400">if</span> (sEarlyFrameBoost) {"{"}<br/>
          {"        "}
          <span className="text-gray-500">// Real-time SCHED_RR elevation for RenderThread</span><br/>
          {"        "}
          base = std::max(base, sBoostEarly);<br/>
          {"    "}{"}"}<br/><br/>
          {"    "}
          <span className="text-purple-400">return</span> sSuspended ? <span className="text-orange-400">0</span> : base;<br/>
          {"}"}
        </pre>
        {/* Glow effect on hover */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-blue-500/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>
    </div>
  );
}

/* ───────────────────────── VULKAN VISUAL ───────────────────────── */
function DualEngineVisual() {
  return (
    <div className="relative w-full max-w-lg aspect-square sm:aspect-[4/3] rounded-2xl bg-black/40 border border-white/10 shadow-2xl p-4 sm:p-6 flex flex-col justify-center items-center gap-8 group overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
      
      {/* Wrapper Block */}
      <div className="w-full flex justify-between items-center relative z-10 px-2 sm:px-8">
        
        {/* Vulkan Engine */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-500/20 to-red-900/40 border border-red-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)] group-hover:scale-105 transition-transform duration-500">
            <Layers className="text-red-400 w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="text-center w-[80px] sm:w-auto">
            <h4 className="text-white font-semibold text-xs sm:text-sm">Vulkan Primary</h4>
            <p className="text-white/40 text-[9px] sm:text-[10px] mt-1 uppercase tracking-wider leading-tight">UI / System Blurs</p>
          </div>
        </div>

        {/* Animated Flow Lines */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 px-2 sm:px-4 min-w-[60px]">
          <div className="w-full h-[2px] bg-gradient-to-r from-red-500/50 via-white/20 to-blue-500/50 relative overflow-hidden rounded-full">
             <div className="absolute inset-y-0 left-0 w-1/3 bg-white/50 blur-[2px] animate-[slide_2s_linear_infinite]" />
          </div>
          <div className="text-[8px] sm:text-[10px] text-white/50 tracking-widest uppercase font-semibold bg-black/40 px-2 sm:px-3 py-1 rounded-full border border-white/5 text-center leading-tight">
            RenderEngine<br className="sm:hidden"/> Wrapper
          </div>
        </div>

        {/* OpenGL Engine */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-900/40 border border-blue-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)] group-hover:scale-105 transition-transform duration-500">
            <Server className="text-blue-400 w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="text-center w-[80px] sm:w-auto">
            <h4 className="text-white font-semibold text-xs sm:text-sm">OpenGL Ganesh</h4>
            <p className="text-white/40 text-[9px] sm:text-[10px] mt-1 uppercase tracking-wider leading-tight">Media / HDR Fallback</p>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ───────────────────────── MAIN COMPONENT ───────────────────────── */
export default function ResearchShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const axBoostRef = useRef<HTMLDivElement>(null);
  const vulkanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in AxBoost block
      gsap.fromTo(axBoostRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: axBoostRef.current, start: "top 80%" }
        }
      );

      // Fade in Vulkan block
      gsap.fromTo(vulkanRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: vulkanRef.current, start: "top 80%" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-32 overflow-hidden">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-axion-accent)] font-medium mb-4">Engineering Research</p>
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
          Engineered from<br />the kernel up.
        </h2>
        <p className="mt-6 text-lg md:text-xl text-[var(--color-axion-text-secondary)] max-w-2xl mx-auto leading-relaxed">
          We don't just patch AOSP. We study scheduling bottlenecks, rewrite render engines, and build frameworks that push hardware to its absolute limit.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-32">
        
        {/* AxBoostFwk Section */}
        <div ref={axBoostRef} className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="text-blue-500 text-sm font-bold tracking-[0.2em] uppercase">AxBoostFwk</span>
              </div>
              <div className="w-12 h-[2px] bg-blue-500/50 rounded-full" />
            </div>
            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Real-time scheduling.<br />Zero jank.
            </h3>
            <p className="text-lg text-[var(--color-axion-text-secondary)] leading-relaxed">
              Vanilla AOSP struggles with UI transitions on MTK and Qualcomm devices due to generic power hints. 
              We built <strong>AxBoostFwk</strong> and <strong>SfCpuPolicy</strong> to fix this at the scheduler level.
            </p>
            <ul className="space-y-4 mt-6">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white/60" />
                </div>
                <p className="text-white/80 leading-relaxed"><strong className="text-white">SCHED_RR Elevation:</strong> SystemUI and RenderThread are pinned to performance cores and elevated to real-time priority during QS panel expansion.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white/60" />
                </div>
                <p className="text-white/80 leading-relaxed"><strong className="text-white">Dynamic uclamp:</strong> SurfaceFlinger's CPU uclamp floors are dynamically adjusted based on the current refresh rate (60/90/120Hz) to guarantee frame deadlines.</p>
              </li>
            </ul>
          </div>
          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <CodeWindow />
          </div>
        </div>

        {/* Vulkan Media Fixes Section */}
        <div ref={vulkanRef} className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
          <div className="flex-1 space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-red-500" />
                <span className="text-red-500 text-sm font-bold tracking-[0.2em] uppercase">Graphics Architecture</span>
              </div>
              <div className="w-12 h-[2px] bg-red-500/50 rounded-full" />
            </div>
            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Vulkan-first.<br />Bulletproof media.
            </h3>
            <p className="text-lg text-[var(--color-axion-text-secondary)] leading-relaxed">
              We need Vulkan for advanced UI effects like Skia system blurs, but some legacy devices corrupt HDR and media when sampling via Vulkan. 
              Our solution: a seamless dual-engine RenderEngine wrapper.
            </p>
            <ul className="space-y-4 mt-6">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white/60" />
                </div>
                <p className="text-white/80 leading-relaxed"><strong className="text-white">Dual-Engine Wrapper:</strong> SurfaceFlinger runs a primary Vulkan engine for the UI, and a secondary OpenGL/Ganesh engine specifically for media-sensitive layers.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white/60" />
                </div>
                <p className="text-white/80 leading-relaxed"><strong className="text-white">Smart Routing:</strong> Video, camera, and Ultra HDR content is automatically routed to OpenGL, while standard composition stays on Vulkan, ensuring pixel-perfect rendering without sacrificing modern features.</p>
              </li>
            </ul>
          </div>
          <div className="flex-1 w-full flex justify-center lg:justify-start">
            <DualEngineVisual />
          </div>
        </div>

      </div>
      
      {/* Custom Animation Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}} />
    </section>
  );
}
