// Performance optimization: Reduce animation complexity on low-end devices
const isLowEndDevice = () => {
  if ('hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4) return true;
  if ('deviceMemory' in navigator && navigator.deviceMemory < 4) return true;
  return false;
};

const shouldReduceMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches || isLowEndDevice();
};

document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll('section, header');
  const speedFactor = 0.5;
  const delayMap = {
    header_green: 250,
    header_game: 0
  };
  const defaultDelay = 100;
  const reduceMotion = shouldReduceMotion();
  
  function animateElements() {
    // Use transform and opacity only for better performance
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const delayPixels = delayMap[el.id] || defaultDelay;
      let progress = (windowHeight - rect.top - delayPixels) / (windowHeight * speedFactor);
      progress = Math.min(Math.max(progress, 0), 1);
      
      if (reduceMotion) {
        // Simplified animation for low-end devices
        el.style.opacity = progress > 0.1 ? '1' : '0';
        el.style.transform = 'translate3d(0, 0, 0)';
      } else {
        const translateY = 30 * (1 - progress);
        el.style.transform = `translate3d(0, ${translateY}px, 0)`;
        el.style.opacity = progress;
      }
    });
  }
  
  let ticking = false;
  const scrollHandler = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        animateElements();
        ticking = false;
      });
      ticking = true;
    }
  };
  
  // Throttle scroll events more aggressively on low-end devices
  const throttleDelay = reduceMotion ? 100 : 16;
  let lastScrollTime = 0;
  window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime >= throttleDelay) {
      scrollHandler();
      lastScrollTime = now;
    }
  }, { passive: true });
  
  animateElements();
  
  // Defer non-critical initialization
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initScreenshot, { timeout: 2000 });
  } else {
    setTimeout(initScreenshot, 0);
  }
});