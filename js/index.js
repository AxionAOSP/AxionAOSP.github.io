function getPageName(path) {
  const cleanPath = path.toLowerCase();
  if (cleanPath.includes("blog.html") || cleanPath.endsWith("/blog") || cleanPath.endsWith("/blog/")) return "blog";
  if (cleanPath.includes("team.html") || cleanPath.endsWith("/team") || cleanPath.endsWith("/team/")) return "team";
  if (cleanPath.includes("about.html") || cleanPath.endsWith("/about") || cleanPath.endsWith("/about/")) return "about";
  if (cleanPath.includes("screenshots.html") || cleanPath.endsWith("/screenshots") || cleanPath.endsWith("/screenshots/")) return "screenshots";
  if (cleanPath.includes("download.html") || cleanPath.endsWith("/download") || cleanPath.endsWith("/download/") || cleanPath.endsWith("/downloads") || cleanPath.endsWith("/downloads/")) return "download";
  if (cleanPath.includes("keybox.html") || cleanPath.endsWith("/keybox") || cleanPath.endsWith("/keybox/")) return "keybox";
  if (cleanPath.includes("post.html") || cleanPath.includes("/post") || cleanPath.includes("post.html?")) return "post";
  if (cleanPath.includes("home.html") || cleanPath === "/" || cleanPath === "" || cleanPath.endsWith("/home") || cleanPath.endsWith("/home/")) return "home";
  return "";
}

const logoEl = document.querySelector(".logo");
if (logoEl) {
  logoEl.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function onUrlChange() {
  const pathname = window.location.pathname;
  if (pathname === '/keybox' || pathname === '/keybox/') {
    window.history.replaceState(null, '', window.location.origin + window.location.pathname.replace(/\/keybox\/?$/, '') + '#keybox');
    animateIframe("keybox.html#keybox");
    return;
  }

  const hash = window.location.hash || "";

  if (hash === "" || hash === "#") {
    const iframe = document.getElementById("contentFrame");
    if (iframe) {
      try {
        const currentPage = getPageName(iframe.contentWindow.location.pathname);
        if (currentPage !== "home") {
          animateIframe("home.html");
        }
      } catch (e) {
        if (!iframe.src.includes("home.html")) {
          animateIframe("home.html");
        }
      }
    }
    return;
  }

  const downloadsRegex = /^#downloads(?:_(.+))?$/;
  const match = hash.match(downloadsRegex);

  if (match) {
    const baseSrc = "download.html#downloads";
    if (match[1]) {
      const rawSearch = match[1];
      const searchText = decodeURIComponent(rawSearch.replace(/_/g, " "));
      localStorage.setItem("deviceSearchText", searchText);
    }
    
    const iframe = document.getElementById("contentFrame");
    if (iframe) {
      try {
        const currentPage = getPageName(iframe.contentWindow.location.pathname);
        if (currentPage === "download") {
          if (match[1] && iframe.contentWindow.initSearch) {
            iframe.contentWindow.initSearch();
          }
          return;
        }
      } catch (e) {}
    }
    animateIframe(baseSrc);
    return;
  }

  const postRegex = /^#post_(.+)$/;
  const postMatch = hash.match(postRegex);
  if (postMatch) {
    const postId = postMatch[1];
    const targetSrc = `post.html?id=${postId}`;
    
    const iframe = document.getElementById("contentFrame");
    if (iframe) {
      try {
        const iframeLoc = iframe.contentWindow.location;
        const currentPath = iframeLoc.pathname + iframeLoc.search;
        if (currentPath.includes(targetSrc)) {
          return;
        }
      } catch (e) {}
    }
    animateIframe(targetSrc);
    return;
  }

  const routeMap = {
    "#about": "about.html",
    "#team": "team.html",
    "#features": "home.html#features",
    "#community": "home.html",
    "#faq": "home.html#faq",
    "#keybox": "keybox.html#keybox",
    "#blog": "blog.html",
    "#screenshots": "screenshots.html"
  };

  const targetSrc = routeMap[hash];
  if (targetSrc) {
    const iframe = document.getElementById("contentFrame");
    if (iframe) {
      try {
        const iframeLoc = iframe.contentWindow.location;
        const currentPage = getPageName(iframeLoc.pathname);
        const expectedPage = getPageName(targetSrc);
        
        if (currentPage === expectedPage) {
          const expectedHash = targetSrc.includes("#") ? targetSrc.split("#")[1] : "";
          const currentHashVal = iframeLoc.hash.replace("#", "");
          if (expectedHash === currentHashVal) {
            return;
          }
        }
      } catch (e) {
        if (iframe.src.includes(targetSrc)) {
          return;
        }
      }
    }
    animateIframe(targetSrc);
  }
}

let isInitialLoad = true;

document.addEventListener("DOMContentLoaded", () => {
  onUrlChange();

  const iframe = document.getElementById("contentFrame");
  if (iframe) {
    iframe.addEventListener("load", () => {
      try {
        const iframeLoc = iframe.contentWindow.location;
        const path = iframeLoc.pathname;
        const search = iframeLoc.search;
        const hashVal = iframeLoc.hash;
        const pageName = getPageName(path);

        if (isInitialLoad) {
          isInitialLoad = false;
          const hash = window.location.hash || "";
          if (hash && hash !== "#" && hash !== "#community") {
            const routeMap = {
              "#about": "about",
              "#team": "team",
              "#features": "home",
              "#faq": "home",
              "#keybox": "keybox",
              "#blog": "blog",
              "#screenshots": "screenshots"
            };
            let expected = routeMap[hash] || "";
            if (!expected) {
              if (hash.startsWith("#post_")) {
                expected = "post";
              } else if (hash.startsWith("#downloads")) {
                expected = "download";
              }
            }
            if (expected && pageName !== expected) {
              return;
            }
          }
        }

        let parentHash = "";
        if (pageName === "blog") {
          parentHash = "#blog";
        } else if (pageName === "team") {
          parentHash = "#team";
        } else if (pageName === "about") {
          parentHash = "#about";
        } else if (pageName === "screenshots") {
          parentHash = "#screenshots";
        } else if (pageName === "download") {
          parentHash = "#downloads";
        } else if (pageName === "keybox") {
          parentHash = "#keybox";
        } else if (pageName === "post") {
          const params = new URLSearchParams(search);
          const postId = params.get("id");
          if (postId) {
            parentHash = `#post_${postId}`;
          }
        } else if (pageName === "home") {
          if (hashVal === "#about") parentHash = "#about";
          else if (hashVal === "#features") parentHash = "#features";
          else if (hashVal === "#faq") parentHash = "#faq";
          else parentHash = "";
        }

        if (window.location.hash !== parentHash) {
          window.removeEventListener("hashchange", onUrlChange);
          window.location.hash = parentHash || "#";
          setTimeout(() => {
            window.addEventListener("hashchange", onUrlChange);
          }, 50);
        }
      } catch (e) {
        console.log("Could not sync iframe location to parent hash", e);
      }
    });
  }
});

window.addEventListener("hashchange", onUrlChange);
