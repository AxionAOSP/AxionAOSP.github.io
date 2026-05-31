document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Staggered Bento Grid reveal
  gsap.fromTo('.bento-box', 
    { y: 50, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      duration: 0.8, 
      stagger: 0.15, 
      ease: 'power3.out', 
      scrollTrigger: { 
        trigger: '.grid', 
        start: 'top 85%' 
      } 
    }
  );
});
