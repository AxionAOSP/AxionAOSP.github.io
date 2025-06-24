const members = [
    { username: 'rmp22', group: 'Core', position: 'Project Founder/Developer' },
    { username: 'Saikrishna1504', group: 'Management', position: 'Project Manager' },
    { username: 'manidweep', group: 'Management', position: 'Project Administrator' },
    { username: 'zenin1504', group: 'Management', position: 'Project Administrator' },
    { username: 'rmuxnet', group: 'Contributors', position: 'AxionAOSP Channel/Chat Bot' },
    { username: 'therealmharc', group: 'Contributors', position: 'Source contributor' },
    { username: 'not-ayan', group: 'Designers', position: 'Designer' },
    { username: 'alecxtra', group: 'Designers', position: 'Designer' }
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
<div class="username">@${member.username}</div>
<div class="position">${member.position}</div>
`;
    return card;
}

function fetchAndCacheAvatar(member, membersRow) {
    fetch(`https://api.github.com/users/${member.username}`)
        .then(res => res.json())
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
