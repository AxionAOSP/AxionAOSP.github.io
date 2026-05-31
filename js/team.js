document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Maintainers List
    const maintainerContainer = document.getElementById('maintainer-list');
    if (maintainerContainer) {
        const maintainers = [
            { gh: 'rmp22', tg: 'rmp22' }, { gh: 'nivlafx', tg: 'Niv' }, { gh: 'austineyoung2000', tg: 'EliteDarkKaiser' },
            { gh: 'heybyben', tg: 'Byben' }, { gh: 'not-ayan', tg: 'Ayan' }, { gh: 'joshuah345', tg: 'hiroshi.' },
            { gh: 'manidweep', tg: 'Itachi' }, { gh: 'genoxci-dev', tg: 'Genoxci' }, { gh: 'sreeshankark', tg: 'Sreeshankar K' },
            { gh: 'NoCache-69', tg: 'Chethan' }, { gh: 'skenakun', tg: 'Yaseakun' }, { gh: 'SenseiiX', tg: 'SENX' },
            { gh: 'zenin1504', tg: 'zenin1504' }, { gh: 'Zarathos30', tg: 'Zarathos' }, { gh: 'RiteshSahany', tg: 'RiteshSahany' },
            { gh: 'kardebayan', tg: 'Debayan Kar' }, { gh: 'Saikrishna1504', tg: 'Saikrishna' }, { gh: 'Amritorock', tg: 'Amritorock' },
            { gh: 'elohim-etz', tg: 'ELOHIM' }, { gh: 'bijoyv9', tg: 'Bijoy' }, { gh: 'mk7x7', tg: 'doissM' },
            { gh: 'Joker-V2', tg: 'Joker-V2' }, { gh: 'rajdeep-3305', tg: 'Casanova.' }, { gh: 'MohammadAlArabi', tg: 'Muhammad Al-Arabi' },
            { gh: 'Never-Alive', tg: 'Lucifer' }, { gh: 'ArKT-7', tg: 'ArKT-7' }, { gh: 'nullpointer1101', tg: 'Null_Pointer' },
            { gh: 'Shirayuki39', tg: 'Shirayuki39' }, { gh: 'KimelaZX', tg: 'KimelaZPrjkt.' }, { gh: 'pabloescobar-reborn', tg: 'PabloEscobar' }
        ];

        maintainers.forEach(m => {
            const anchor = document.createElement('a');
            anchor.href = `https://github.com/${m.gh}`;
            anchor.target = '_blank';
            anchor.className = 'relative group cursor-pointer maintainer-block opacity-0 translate-y-4 block';
            anchor.innerHTML = `
                <div class="maintainer-avatar w-16 h-16 md:w-20 md:h-20 shadow-lg mx-auto">
                    <img src="https://github.com/${m.gh}.png?size=150" alt="${m.tg}" class="w-full h-full object-cover" onerror="this.src='https://github.com/ghost.png?size=150'" />
                </div>
                <div class="maintainer-tooltip bg-[#111] border border-white/10 px-4 py-2 rounded-lg shadow-xl text-center">
                    <div class="text-white font-sans text-sm font-bold">${m.tg}</div>
                    <div class="text-white/40 font-mono text-[10px] mt-0.5">@${m.gh}</div>
                </div>
            `;
            maintainerContainer.appendChild(anchor);
        });
    }

    // 2. Initialize Animations
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
});
