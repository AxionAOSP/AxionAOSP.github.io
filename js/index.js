document.querySelector(".logo").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function onUrlChange() {
  const pathname = window.location.pathname;
  if (pathname === '/keybox' || pathname === '/keybox/') {
    window.history.replaceState(null, '', window.location.origin + window.location.pathname.replace(/\/keybox\/?$/, '') + '#keybox');
    animateIframe("keybox.html#keybox");
    return;
  }

  const hash = window.location.hash;
  const downloadsRegex = /^#downloads(?:_(.+))?$/;
  const match = hash.match(downloadsRegex);

  if (match) {
    const baseSrc = "download.html#downloads";
    if (match[1]) {
      const rawSearch = match[1];
      const searchText = decodeURIComponent(rawSearch.replace(/_/g, " "));
      localStorage.setItem("deviceSearchText", searchText);
    }
    animateIframe(baseSrc);
    return;
  }

  const routeMap = {
    "#about": "home.html#about",
    "#team": "about.html#team",
    "#features": "home.html#features",
    "#community": "home.html#community",
    "#faq": "home.html#faq",
    "#keybox": "keybox.html#keybox",
    "#blog": "blog.html#blog"
  };

  const targetSrc = routeMap[hash];
  if (targetSrc) {
    animateIframe(targetSrc);
  }
}

document.addEventListener("DOMContentLoaded", onUrlChange);
window.addEventListener("hashchange", onUrlChange);
