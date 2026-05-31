document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;

  const faqItems = document.querySelectorAll('.faq-item');
  let activeFaq = null;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const verticalIconLine = item.querySelector('.faq-icon-vertical');

    if (trigger && content && verticalIconLine) {
      trigger.addEventListener('click', () => {
        if (activeFaq === item) {
          gsap.to(content, { height: 0, opacity: 0, duration: 0.6, ease: "power3.inOut" });
          gsap.to(verticalIconLine, { rotation: 0, duration: 0.4, ease: "power3.inOut" });
          activeFaq = null;
          return;
        }
        if (activeFaq) {
          const activeContent = activeFaq.querySelector('.faq-content');
          const activeIconLine = activeFaq.querySelector('.faq-icon-vertical');
          gsap.to(activeContent, { height: 0, opacity: 0, duration: 0.6, ease: "power3.inOut" });
          gsap.to(activeIconLine, { rotation: 0, duration: 0.4, ease: "power3.inOut" });
        }
        gsap.to(content, { height: 'auto', opacity: 1, duration: 0.6, ease: "power3.inOut" });
        gsap.to(verticalIconLine, { rotation: 90, duration: 0.4, ease: "power3.inOut" }); 
        activeFaq = item;
      });
    }
  });
});
