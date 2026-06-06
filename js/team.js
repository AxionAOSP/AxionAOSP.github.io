const MAINTAINERS_API_URL = 'https://raw.githubusercontent.com/AxionAOSP/official_devices/refs/heads/main/api/maintainers.json';
const TEAM_HTML_ENTITIES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

document.addEventListener('DOMContentLoaded', async () => {
    const maintainerContainer = document.getElementById('maintainer-list');

    if (maintainerContainer) {
        const maintainers = await fetchMaintainers();
        renderMaintainers(maintainerContainer, maintainers);
    }

    initTeamAnimations();
});

async function fetchMaintainers() {
    try {
        const response = await fetch(MAINTAINERS_API_URL, { cache: 'default' });
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return Array.isArray(data.maintainers) ? data.maintainers : [];
    } catch (error) {
        console.error('Error loading maintainers:', error);
        return [];
    }
}

function renderMaintainers(container, maintainers) {
    container.innerHTML = '';

    maintainers.forEach(maintainer => {
        const github = maintainer.github_username || maintainer.id;
        const name = maintainer.name || github;
        const profileUrl = maintainer.profile_url || `https://github.com/${github}`;
        const avatarUrl = maintainer.avatar_url || `https://github.com/${github}.png?size=150`;
        const anchor = document.createElement('a');

        anchor.href = profileUrl;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.className = 'relative group cursor-pointer maintainer-block opacity-0 translate-y-4 block';
        anchor.innerHTML = `
            <div class="maintainer-avatar w-16 h-16 md:w-20 md:h-20 shadow-lg mx-auto">
                <img src="${escapeTeamAttribute(avatarUrl)}" alt="${escapeTeamHtml(name)}" class="w-full h-full object-cover" onerror="this.src='https://github.com/ghost.png?size=150'" />
            </div>
            <div class="maintainer-tooltip bg-[#111] border border-white/10 px-4 py-2 rounded-lg shadow-xl text-center">
                <div class="text-white font-sans text-sm font-bold">${escapeTeamHtml(name)}</div>
                <div class="text-white/40 font-mono text-[10px] mt-0.5">@${escapeTeamHtml(github)}</div>
            </div>
        `;
        container.appendChild(anchor);
    });
}

function escapeTeamHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => TEAM_HTML_ENTITIES[char]);
}

function escapeTeamAttribute(value) {
    return escapeTeamHtml(value);
}

function initTeamAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Core constellation parallax effect
    const teamCircles = document.querySelectorAll('.team-circle');
    if (document.getElementById('team-constellation')) {
        teamCircles.forEach((circle) => {
            const speed = circle.getAttribute('data-speed') || 1;
            gsap.to(circle.parentElement, {
                y: () => -100 * speed,
                ease: "none",
                scrollTrigger: {
                    trigger: "#team-constellation",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });
        });
    }

    // Staggered grid reveal for maintainers
    if (document.querySelector('.maintainer-block')) {
        ScrollTrigger.batch(".maintainer-block", {
            start: "top 85%",
            onEnter: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.05, duration: 0.8, ease: "power3.out"}),
            onLeaveBack: batch => gsap.to(batch, {opacity: 0, y: 4, stagger: 0.05, duration: 0.4})
        });
    }

    ScrollTrigger.refresh();
}
