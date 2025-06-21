document.querySelector(".logo").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function onUrlChange() {
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
    "#features": "home.html#features",
    "#community": "home.html#community",
    "#faq": "home.html#faq",
    "#keybox": "keybox.html#keybox"
  };

  const targetSrc = routeMap[hash];
  if (targetSrc) {
    animateIframe(targetSrc);
  }
}

document.addEventListener("DOMContentLoaded", onUrlChange);
window.addEventListener("hashchange", onUrlChange);