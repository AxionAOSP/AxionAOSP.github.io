document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || !document.getElementById('cinematic-showcase')) return;

  // Ensure initial card visibility to prevent flash of unstyled content
  gsap.set(['.mockup-preview', '.axion-card'], { visibility: 'visible' });

  
  /* 3D Coverflow Wallpaper Logic */
  
  function updateCoverflow() {
    const items = document.querySelectorAll('.carousel-item');
    if (!items.length) return;
    
    const centerX = window.innerWidth / 2;
    
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const dist = itemCenterX - centerX;
      
      let rotY = (dist / window.innerWidth) * 120;
      rotY = Math.max(-60, Math.min(60, rotY)); 
      
      let scale = 1 - Math.abs(dist / window.innerWidth) * 0.5;
      scale = Math.max(0.7, scale); 
      
      let brightness = 1 - Math.abs(dist / window.innerWidth) * 0.8;
      brightness = Math.max(0.3, brightness); 

      gsap.set(item, {
        rotationY: rotY,
        scale: scale,
        filter: `brightness(${brightness})`,
        z: -Math.abs(dist) * 0.6 
      });
    });
  }

  updateCoverflow();

  function getCarouselMoveAmount() {
    const item = document.querySelector('.carousel-item');
    if(!item) return 0;
    const gap = window.innerWidth >= 768 ? 64 : 32;
    return item.offsetWidth + gap;
  }

  
  /* Pre-Setup States */ 
  
  
  gsap.set(['#c2-s2', '#c2-s3', '#c3-s2', '#c3-s3', '#c3-s4', '#c3-s5', '#c4-s2', '#c4-s3', '#c5-s2', '#c5-s3', '#c6-s2', '#c6-s3', '#c6-s4'], { 
      xPercent: 100, 
      autoAlpha: 0 
  });

  gsap.set(['#c6-t2', '#c6-t3', '#c6-t4'], { 
      y: 20, 
      autoAlpha: 0 
  });

  
  /* Master Cinematic Timeline */
  

  const showcase = document.getElementById('cinematic-showcase');

  let masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: showcase,
      start: 'top top',
      end: () => window.innerWidth < 768 ? '+=4000%' : '+=3400%', 
      pin: true, 
      scrub: 1, 
      invalidateOnRefresh: true,
      onUpdate: updateCoverflow,
    }
  });

  // Sequence 1: Card 1 (Depth Wallpapers Horizontal Scroll)
  masterTl.addLabel("c1-1") 
          .to('#carousel-track', { x: () => -getCarouselMoveAmount(), duration: 1 }, "+=0.5")
          .addLabel("c1-2") 
          .to('#carousel-track', { x: () => -(getCarouselMoveAmount() * 2), duration: 1 }, "+=0.5")
          .addLabel("c1-3")
          .to('#carousel-track', { x: () => -(getCarouselMoveAmount() * 3), duration: 1 }, "+=0.5")
          .addLabel("c1-4")
          .to('#carousel-track', { x: () => -(getCarouselMoveAmount() * 4), duration: 1 }, "+=0.5")
          .addLabel("c1-5");

  // Sequence 2: Transition to Card 2 (Dynamic Bar)
  masterTl.to('#card-2', { yPercent: -100, duration: 2, ease: "power2.inOut" }, "+=0.5")
          .to('#card-1 .relative', { scale: 0.92, opacity: 0.3, filter: 'blur(10px)', duration: 2, ease: "power2.inOut" }, "<")
          .addLabel("c2-1"); 

  // Sequence 3: Card 2 Slides (Dynamic Bar)
  masterTl.to('#c2-s1', { xPercent: -100, autoAlpha: 0, duration: 1 }, "+=0.5")
          .to('#c2-s2', { xPercent: 0, autoAlpha: 1, duration: 1 }, "<")
          .addLabel("c2-2") 
          
          .to('#c2-s2', { xPercent: -100, autoAlpha: 0, duration: 1 }, "+=0.5")
          .to('#c2-s3', { xPercent: 0, autoAlpha: 1, duration: 1 }, "<")
          .addLabel("c2-3"); 

  // Sequence 4: Transition to Card 3 (New Clocks)
  masterTl.to('#card-3', { yPercent: -100, duration: 2, ease: "power2.inOut" }, "+=0.5")
          .to('#card-2 .relative', { scale: 0.92, autoAlpha: 0.3, filter: 'blur(10px)', duration: 2, ease: "power2.inOut" }, "<")
          .addLabel("c3-1"); 

  // Sequence 5: Card 3 Slides (New Clocks)
  masterTl.to('#c3-s1', { xPercent: -100, autoAlpha: 0, duration: 1 }, "+=0.5")
          .to('#c3-s2', { xPercent: 0, autoAlpha: 1, duration: 1 }, "<")
          .addLabel("c3-2") 
          
          .to('#c3-s2', { xPercent: -100, autoAlpha: 0, duration: 1 }, "+=0.5")
          .to('#c3-s3', { xPercent: 0, autoAlpha: 1, duration: 1 }, "<")
          .addLabel("c3-3") 
          
          .to('#c3-s3', { xPercent: -100, autoAlpha: 0, duration: 1 }, "+=0.5")
          .to('#c3-s4', { xPercent: 0, autoAlpha: 1, duration: 1 }, "<")
          .addLabel("c3-4") 
          
          .to('#c3-s4', { xPercent: -100, autoAlpha: 0, duration: 1 }, "+=0.5")
          .to('#c3-s5', { xPercent: 0, autoAlpha: 1, duration: 1 }, "<")
          .addLabel("c3-5"); 

  // Sequence 6: Transition to Card 4 (Routines)
  masterTl.to('#card-4', { yPercent: -100, duration: 2, ease: "power2.inOut" }, "+=0.5")
          .to('#card-3 .relative', { scale: 0.92, autoAlpha: 0.3, filter: 'blur(10px)', duration: 2, ease: "power2.inOut" }, "<")
          .addLabel("c4-1"); 

  // Sequence 7: Card 4 Slides (Routines)
  masterTl.to('#c4-s1', { xPercent: -100, autoAlpha: 0, duration: 1 }, "+=0.5")
          .to('#c4-s2', { xPercent: 0, autoAlpha: 1, duration: 1 }, "<")
          .addLabel("c4-2") 

          .to('#c4-s2', { xPercent: -100, autoAlpha: 0, duration: 1 }, "+=0.5")
          .to('#c4-s3', { xPercent: 0, autoAlpha: 1, duration: 1 }, "<")
          .addLabel("c4-3");

  // Sequence 8: Transition to Card 5 (System Control)
  masterTl.to('#card-5', { yPercent: -100, duration: 2, ease: "power2.inOut" }, "+=0.5")
          .to('#card-4 .relative', { scale: 0.92, opacity: 0.3, filter: 'blur(10px)', duration: 2, ease: "power2.inOut" }, "<")
          .addLabel("c5-1"); 

  // Sequence 9: Card 5 Slides
  masterTl.to('#c5-s1', { xPercent: -100, autoAlpha: 0, duration: 1 }, "+=0.5")
          .to('#c5-s2', { xPercent: 0, autoAlpha: 1, duration: 1 }, "<")
          .addLabel("c5-2")
          
          .to('#c5-s2', { xPercent: -100, autoAlpha: 0, duration: 1 }, "+=0.5")
          .to('#c5-s3', { xPercent: 0, autoAlpha: 1, duration: 1 }, "<")
          .addLabel("c5-3");

  // Sequence 10: Transition to Card 6 (Wait, there's more)
  masterTl.to('#card-6', { yPercent: -100, duration: 2, ease: "power2.inOut" }, "+=0.5")
          .to('#card-5 .relative', { scale: 0.92, autoAlpha: 0.3, filter: 'blur(10px)', duration: 2, ease: "power2.inOut" }, "<")
          .addLabel("c6-1"); 

  // Sequence 11: Card 6 Slides
  masterTl.to('#c6-s1', { xPercent: -100, autoAlpha: 0, duration: 1 }, "+=0.5")
          .to('#c6-t1', { y: -20, autoAlpha: 0, duration: 1 }, "<") 
          .to('#c6-s2', { xPercent: 0, autoAlpha: 1, duration: 1 }, "<")
          .to('#c6-t2', { y: 0, autoAlpha: 1, duration: 1 }, "<") 
          .addLabel("c6-2")
          
          .to('#c6-s2', { xPercent: -100, autoAlpha: 0, duration: 1 }, "+=0.5")
          .to('#c6-t2', { y: -20, autoAlpha: 0, duration: 1 }, "<")
          .to('#c6-s3', { xPercent: 0, autoAlpha: 1, duration: 1 }, "<")
          .to('#c6-t3', { y: 0, autoAlpha: 1, duration: 1 }, "<")
          .addLabel("c6-3")

          .to('#c6-s3', { xPercent: -100, autoAlpha: 0, duration: 1 }, "+=0.5")
          .to('#c6-t3', { y: -20, autoAlpha: 0, duration: 1 }, "<")
          .to('#c6-s4', { xPercent: 0, autoAlpha: 1, duration: 1 }, "<")
          .to('#c6-t4', { y: 0, autoAlpha: 1, duration: 1 }, "<")
          .addLabel("c6-4");

  // GameSpace Video Reveal
  gsap.from('.gaming-video-container', {
    scale: 0.85,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: '#gaming-section',
      start: 'top 70%',
    }
  });

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});
