"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollingProps {
  children: ReactNode;
}

export default function SmoothScrolling({ children }: SmoothScrollingProps) {
  const lenisRef = useRef<any>(null);
  const [isTouch, setIsTouch] = useState<boolean>(false);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    setIsTouch(isTouchDevice);

    gsap.config({ force3D: true });
    ScrollTrigger.config({ 
      limitCallbacks: true,
      ignoreMobileResize: true 
    });

    if (!isTouchDevice) {
      function update(time: number) {
        if (lenisRef.current?.lenis) {
          lenisRef.current.lenis.raf(time * 1000);
        }
      }
    
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0); // Important for perfect sync
    
      return () => {
        gsap.ticker.remove(update);
      };
    }
  }, []);

  if (isTouch) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false} options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}

