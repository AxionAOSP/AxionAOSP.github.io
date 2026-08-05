"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Team", href: "/contributors" },
    { name: "Blog", href: "/blog" },
    { name: "Changelog", href: "/changelog" },
  ];

  const isHome = pathname === "/";

  let navContainerClasses = "fixed top-0 inset-x-0 z-50 transition-all duration-300 px-6 ";
  if (isHome) {
    if (scrolled) {
      navContainerClasses += "py-4 -translate-y-full opacity-0 pointer-events-none";
    } else {
      navContainerClasses += "py-6 translate-y-0 opacity-100";
    }
  } else {
    if (scrolled) {
      navContainerClasses += "py-4 translate-y-0 opacity-100";
    } else {
      navContainerClasses += "py-6 translate-y-0 opacity-100";
    }
  }

  return (
    <header className={navContainerClasses}>
      {/* Background layer to animate opacity instead of backdrop-filter to prevent browser rendering glitches */}
      {!isHome && (
        <div 
          className={`absolute inset-0 bg-[#0a0706]/80 backdrop-blur-xl border-b border-white/10 transition-opacity duration-300 -z-10 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`} 
        />
      )}
      
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between h-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img src={`${process.env.NODE_ENV === 'production' ? '/axion' : ''}/logo.svg`} alt="Axion OS Logo" className="w-8 h-8" />
          <span className="text-white font-bold text-xl tracking-tight">Axion OS</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <Link
            href="/download"
            className="px-5 py-2 bg-[var(--color-axion-accent)] hover:bg-[var(--color-axion-accent-hover)] text-[#100B09] text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(255,100,0,0.2)] hover:shadow-[0_0_25px_rgba(255,100,0,0.4)] transition-all duration-300 hover:scale-[1.03]"
          >
            Download
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-3xl border-b border-white/10 flex flex-col md:hidden py-6 px-6 gap-4 overflow-hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg font-medium py-1 transition-colors ${
                  pathname === link.href
                    ? "text-white"
                    : "text-white/60"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/download"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 w-full py-3 text-center bg-[var(--color-axion-accent)] text-[#100B09] font-bold text-sm uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(255,100,0,0.15)] block"
            >
              Download
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
