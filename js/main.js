document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll('section, header');
  const speedFactor = 0.5;
  const delayMap = {
    header_green: 250,
    header_game: 0
  };
  const defaultDelay = 100;
  function animateElements() {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const delayPixels = delayMap[el.id] || defaultDelay;
      let progress = (windowHeight - rect.top - delayPixels) / (windowHeight * speedFactor);
      progress = Math.min(Math.max(progress, 0), 1);
      const translateY = 30 * (1 - progress);
      const opacity = progress;
      el.style.transform = `translateY(${translateY}px)`;
      el.style.opacity = opacity;
    });
  }
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        animateElements();
        ticking = false;
      });
      ticking = true;
    }
  });
  animateElements();
  initScreenshot();
});