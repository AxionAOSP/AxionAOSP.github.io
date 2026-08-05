"use client";

import { useState } from "react";
import Image from "next/image";
import { Smartphone } from "lucide-react";

interface DeviceImageProps {
  sources: string[];
  alt: string;
  className?: string;
}

export default function DeviceImage({ sources, alt, className }: DeviceImageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);

  // Filter out any undefined/empty sources
  const validSources = sources.filter((src) => src && src.trim() !== "");

  if (validSources.length === 0 || hasFailed) {
    return (
      <div className={`flex items-center justify-center ${className || ''}`}>
        <Smartphone className="w-1/2 h-1/2 text-white/10" />
      </div>
    );
  }

  return (
    <Image
      src={validSources[currentIndex]}
      alt={alt}
      fill
      className={className}
      unoptimized
      onError={() => {
        if (currentIndex < validSources.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setHasFailed(true);
        }
      }}
    />
  );
}
