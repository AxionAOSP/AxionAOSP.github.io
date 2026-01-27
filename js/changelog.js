document.addEventListener('DOMContentLoaded', function () {
  const changelogList = document.getElementById('changelog-list');
  const rawUrl = 'https://raw.githubusercontent.com/AxionAOSP/axion_changelogs/refs/heads/lineage-23.1/README.md';

  const renderer = new marked.Renderer();

  renderer.heading = (text, level) => {
    return `<h3 style="margin-top: 20px; margin-bottom: 10px;">${text}</h3>`;
  };

  renderer.list = (body, ordered) => body;

  renderer.listitem = (text) => {
    const parsedText = marked.parseInline(text);
    const isNested = text.startsWith('  ');
    const margin = isNested ? 'style="margin-left: 20px"' : '';
    return `<p ${margin}>- ${parsedText}</p>`;
  };

  marked.setOptions({
    renderer,
    breaks: false,
    gfm: true,
    smartypants: true,
    smartLists: true
  });

  fetch(rawUrl)
    .then(response => response.text())
    .then(md => {
      const cleanedMd = md
        .split(/##\s*🔄\s*Previous Releases/i)[0]
        .replace(/^#.*?\n/, '')
        .replace(/\n\s+-/g, '\n-')
        .replace(/\n{2,}/g, '\n');

      let html = marked.parse(cleanedMd);
      changelogList.innerHTML = html;
    })
    .catch(error => console.error(error));
});

document.addEventListener("DOMContentLoaded", () => {
  const changelogLinks = document.querySelectorAll('a[href*="#changelog"]');
  const changelogModal = document.getElementById("changelogModal");
  const closeChangelogBtn = document.getElementById("closeChangelogBtn");

  changelogLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      changelogModal.style.display = "flex";
    });
  });

  closeChangelogBtn.addEventListener("click", () => {
    changelogModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === changelogModal) {
      changelogModal.style.display = "none";
    }
  });
});

  

