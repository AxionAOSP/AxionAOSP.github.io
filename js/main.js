document.addEventListener('DOMContentLoaded', () => {
  // Initialize application loader
  const loader = document.getElementById('loader');
  if(loader) {
    loader.style.opacity = '0'; 
    setTimeout(() => loader.remove(), 500); 
  }

  // Initialize Lenis smooth scrolling
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      lerp: 0.05,
      smoothWheel: true,
      touchMultiplier: 2,
    });

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000) });
      gsap.ticker.lagSmoothing(1000, 16); // Gentle lag smoothing for high refresh rates
      ScrollTrigger.config({ ignoreMobileResize: true });
    }
  }

  // Initialize ambient background orbs animation
  if (typeof gsap !== 'undefined') {
    const orbs = document.querySelectorAll('.ambient-orb');
    orbs.forEach((orb) => {
      gsap.to(orb, {
        x: () => gsap.utils.random(-150, 150),
        y: () => gsap.utils.random(-150, 150),
        scale: () => gsap.utils.random(0.8, 1.2),
        duration: () => gsap.utils.random(10, 20),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        force3D: true,
        onRepeat: function() {
          gsap.to(orb, {
            x: gsap.utils.random(-150, 150),
            y: gsap.utils.random(-150, 150),
            duration: gsap.utils.random(10, 20),
            ease: "sine.inOut",
            force3D: true
          });
        }
      });
    });

    // Initialize scroll-triggered reveals
    gsap.utils.toArray('.reveal-element, .reveal-fade').forEach(elem => {
      gsap.fromTo(elem, 
        { y: 30, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: 'power3.out', 
          scrollTrigger: { trigger: elem, start: 'top 85%' } 
        }
      );
    });
  }
});
