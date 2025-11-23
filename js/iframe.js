function loadPage(e) {
  e.preventDefault();
  const url = e.currentTarget.href;
  animateIframe(url);
}

function animateIframe(url) {
  const iframe = document.getElementById("contentFrame");
  iframe.style.opacity = 0;
  setTimeout(() => {
    iframe.src = url;
    setTimeout(() => {
        iframe.style.opacity = 1;
        if (url.includes('#team')) {
          setTimeout(() => {
            try {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
              const teamHeader = iframeDoc.getElementById('team-header');
              if (teamHeader) {
                const offset = 120;
                const elementPosition = teamHeader.getBoundingClientRect().top;
                const offsetPosition = elementPosition + iframe.contentWindow.pageYOffset - offset;
                iframe.contentWindow.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                });
              } else {
                const teamSection = iframeDoc.getElementById('team');
                if (teamSection) {
                  const offset = 120;
                  const elementPosition = teamSection.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + iframe.contentWindow.pageYOffset - offset;
                  iframe.contentWindow.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                }
              }
            } catch (e) {
              console.log('Could not access iframe content for scrolling');
            }
          }, 500);
        }
    }, 100);
  }, 250);
}