"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SmoothScrollingProps {
  children: ReactNode;
}

export default function SmoothScrolling({ children }: SmoothScrollingProps) {
  useEffect(() => {
    // Enable 3D hardware acceleration globally across all GSAP animations
    gsap.config({ force3D: true });
    
    // Optimize ScrollTrigger refresh/callbacks thread blocking on fast scrolls
    ScrollTrigger.config({ limitCallbacks: true });
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
