"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isDownloadPage = pathname?.startsWith("/download");
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 40, filter: "blur(10px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={`relative ${isHomePage ? 'pt-32 md:pt-48' : 'pt-16'} pb-8 md:pb-12 px-6 w-full`}>
      {/* Final ambient glow */}
      {isHomePage && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-axion-accent)] opacity-[0.06] blur-[150px] rounded-full pointer-events-none" />
      )}

      <div ref={contentRef} className="max-w-4xl mx-auto text-center">
        {isHomePage && (
          <>
            <h2 className="text-6xl md:text-9xl font-bold tracking-[-0.04em] text-gradient mb-6">
              AXION
            </h2>
        <p className="text-xl md:text-2xl text-[var(--color-axion-text-secondary)] mb-12 max-w-xl mx-auto">
          The Android experience, reimagined. Beautiful. Fast. Yours.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="https://github.com/AxionAOSP"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 bg-white text-[var(--color-axion-bg)] rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] inline-flex items-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
          <a
            href="https://t.me/AxionOS_android"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 glass-panel rounded-full font-bold text-lg text-white hover:scale-105 transition-all duration-300 hover:border-[var(--color-axion-accent)]/30 inline-flex items-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Telegram
          </a>
        </div>

        {!isDownloadPage && (
          <Link 
            href="/download" 
            className="block group glass-panel rounded-2xl p-8 max-w-md mx-auto mb-16 hover:bg-white/5 hover:border-[var(--color-axion-accent)]/30 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,100,0,0.1)] transition-all duration-300 cursor-pointer"
          >
            <p className="text-sm text-[var(--color-axion-accent)] uppercase tracking-widest font-bold mb-2 flex items-center justify-center gap-2">
              Find your device
              <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </p>
            <p className="text-[var(--color-axion-text-secondary)] text-sm group-hover:text-white/90 transition-colors">
              Check out our fully interactive devices portal to see if your phone is officially supported by Axion OS.
            </p>
          </Link>
        )}
          </>
        )}

        <div className={`${isHomePage ? "border-t border-[var(--color-axion-border)] pt-8" : "pt-0"} flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--color-axion-text-secondary)]`}>
          <p>© 2025 - 2026 Axion OS. All rights reserved.</p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[var(--color-axion-text-secondary)]">
            <Link href="/download" className="hover:text-white transition-colors">Downloads</Link>
            <Link href="/contributors" className="hover:text-white transition-colors">Team</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/keybox" className="hover:text-white transition-colors">Keybox</Link>
            <a href="https://github.com/AxionAOSP" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Source Code</a>
          </div>
        </div>
      </div>
    </section>
  );
}
