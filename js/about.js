const members = [
    { username: 'rmp22', group: 'Core', position: 'Project Founder/Developer' },
    { username: 'Saikrishna1504', group: 'Management', position: 'Project Manager/Core Member' },
    { username: 'manidweep', group: 'Management', position: 'Project Administrator' },
    { username: 'AlisterGrey', group: 'Contributors', position: 'Designer' },
    { username: 'alecxtra', group: 'Contributors', position: 'Designer' },
    { username: 'not-ayan', group: 'Contributors', position: 'Axion Bot Maintainer' },
    { username: 'Rve27', group: 'Contributors', position: 'Code Contributor' }
];

const teamContainer = document.getElementById('team');

const groupedMembers = {};
members.forEach(member => {
    if (!groupedMembers[member.group]) {
        groupedMembers[member.group] = [];
    }
    groupedMembers[member.group].push(member);
});

function createMemberCard(member, avatarUrl) {
    const card = document.createElement('div');
    card.classList.add('member-card');
    card.innerHTML = `
<img src="${avatarUrl}" alt="${member.username}'s avatar" class="avatar" />
<div class="username">
    <a href="https://github.com/${member.username}" target="_blank" rel="noopener noreferrer">@${member.username}</a>
</div>
<div class="position">${member.position}</div>
`;
    return card;
}

// Performance: Cache fetch requests
const avatarFetchCache = new Map();
const AVATAR_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

async function cachedAvatarFetch(username) {
    const cacheKey = `avatar_api_${username}`;
    const cached = avatarFetchCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < AVATAR_CACHE_DURATION) {
        return cached.data;
    }
    
    try {
        const res = await fetch(`https://api.github.com/users/${username}`, {
            cache: 'default'
        });
        const data = await res.json();
        avatarFetchCache.set(cacheKey, {
            data: data,
            timestamp: now
        });
        return data;
    } catch (error) {
        throw error;
    }
}

function fetchAndCacheAvatar(member, membersRow) {
    cachedAvatarFetch(member.username)
        .then(data => {
            let avatarUrl = `https://github.com/${member.username}.png?size=120&default=identicon`;

            if (data.avatar_url && typeof data.avatar_url === 'string') {
                avatarUrl = data.avatar_url;
            }

            const cached = localStorage.getItem(`avatar_${member.username}`);
            if (cached !== avatarUrl) {
                localStorage.setItem(`avatar_${member.username}`, avatarUrl);
            }

            const card = createMemberCard(member, avatarUrl);
            membersRow.appendChild(card);
        })
        .catch(err => {
            console.warn(`Failed to fetch from API for ${member.username}. Using identicon fallback.`, err);
            const fallbackUrl = `https://github.com/${member.username}.png?size=120&default=identicon`;
            const card = createMemberCard(member, fallbackUrl);
            membersRow.appendChild(card);
        });
}

Object.entries(groupedMembers).forEach(([position, groupMembers]) => {
    const groupDiv = document.createElement('div');
    groupDiv.classList.add('team-group');

    const title = document.createElement('div');
    title.classList.add('team-title');
    title.textContent = position;
    groupDiv.appendChild(title);

    const membersRow = document.createElement('div');
    membersRow.classList.add('team-members');

    groupMembers.forEach(member => {
        const cachedAvatar = localStorage.getItem(`avatar_${member.username}`);

        if (cachedAvatar) {
            const card = createMemberCard(member, cachedAvatar);
            membersRow.appendChild(card);
        } else {
            fetchAndCacheAvatar(member, membersRow);
        }
    });

    groupDiv.appendChild(membersRow);
    teamContainer.appendChild(groupDiv);
});

// Performance: Cache device maintainers fetch
const deviceMaintainersCache = new Map();
const MAINTAINERS_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function fetchDeviceMaintainers() {
    try {
        const cacheKey = 'device_maintainers';
        const cached = deviceMaintainersCache.get(cacheKey);
        const now = Date.now();
        
        let data;
        if (cached && (now - cached.timestamp) < MAINTAINERS_CACHE_DURATION) {
            data = cached.data;
        } else {
            const response = await fetch('https://raw.githubusercontent.com/AxionAOSP/official_devices/refs/heads/main/dinfo.json', {
                cache: 'default'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch device info: ${response.status}`);
            }
            
            data = await response.json();
            deviceMaintainersCache.set(cacheKey, {
                data: data,
                timestamp: now
            });
        }
        const devices = data.devices || [];
        
        const maintainerMap = new Map();
        
        devices.forEach(device => {
            const statusValue = device.status || 'Active';
            const statusLower = String(statusValue).toLowerCase();
            const isActive = statusLower === 'active';
            
            if (device.github_username && device.maintainer && isActive) {
                const username = device.github_username;
                if (!maintainerMap.has(username)) {
                    maintainerMap.set(username, {
                        username: username,
                        maintainer: device.maintainer,
                        devices: []
                    });
                }
                maintainerMap.get(username).devices.push(device.device_name || device.codename);
            }
        });
        
        const maintainers = Array.from(maintainerMap.values());
        
        if (maintainers.length > 0) {
            const maintainersGroupDiv = document.createElement('div');
            maintainersGroupDiv.classList.add('team-group');

            const maintainersTitle = document.createElement('div');
            maintainersTitle.classList.add('team-title');
            maintainersTitle.textContent = 'Active Device Maintainers';
            maintainersGroupDiv.appendChild(maintainersTitle);

            const maintainersRow = document.createElement('div');
            maintainersRow.classList.add('team-members');

            maintainers.forEach(maintainer => {
                const cachedAvatar = localStorage.getItem(`avatar_${maintainer.username}`);

                if (cachedAvatar) {
                    const card = createMaintainerCard(maintainer, cachedAvatar);
                    maintainersRow.appendChild(card);
                } else {
                    fetchAndCacheMaintainerAvatar(maintainer, maintainersRow);
                }
            });

            maintainersGroupDiv.appendChild(maintainersRow);
            teamContainer.appendChild(maintainersGroupDiv);
        }
    } catch (error) {
        console.error('Error fetching device maintainers:', error);
    }
}

function createMaintainerCard(maintainer, avatarUrl) {
    const card = document.createElement('div');
    card.classList.add('member-card');
    card.innerHTML = `
<img src="${avatarUrl}" alt="${maintainer.username}'s avatar" class="avatar" />
<div class="username">
    <a href="https://github.com/${maintainer.username}" target="_blank" rel="noopener noreferrer">@${maintainer.username}</a>
</div>
<div class="position">${maintainer.maintainer}</div>
`;
    return card;
}

function fetchAndCacheMaintainerAvatar(maintainer, membersRow) {
    cachedAvatarFetch(maintainer.username)
        .then(data => {
            let avatarUrl = `https://github.com/${maintainer.username}.png?size=120&default=identicon`;

            if (data.avatar_url && typeof data.avatar_url === 'string') {
                avatarUrl = data.avatar_url;
            }

            const cached = localStorage.getItem(`avatar_${maintainer.username}`);
            if (cached !== avatarUrl) {
                localStorage.setItem(`avatar_${maintainer.username}`, avatarUrl);
            }

            const card = createMaintainerCard(maintainer, avatarUrl);
            membersRow.appendChild(card);
        })
        .catch(err => {
            console.warn(`Failed to fetch from API for ${maintainer.username}. Using identicon fallback.`, err);
            const fallbackUrl = `https://github.com/${maintainer.username}.png?size=120&default=identicon`;
            const card = createMaintainerCard(maintainer, fallbackUrl);
            membersRow.appendChild(card);
        });
}

fetchDeviceMaintainers();

function scrollToTeam() {
    if (window.location.hash === '#team') {
        setTimeout(() => {
            const teamHeader = document.getElementById('team-header');
            if (teamHeader) {
                const offset = 120;
                const elementPosition = teamHeader.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            } else {
                const teamSection = document.getElementById('team');
                if (teamSection) {
                    const offset = 120;
                    const elementPosition = teamSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }, 500);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scrollToTeam);
} else {
    scrollToTeam();
}
window.addEventListener('hashchange', scrollToTeam);
