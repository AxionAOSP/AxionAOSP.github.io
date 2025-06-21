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
    }, 100);
  }, 250);
}