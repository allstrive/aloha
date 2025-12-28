const duplicateSets = [
    {
        id: 1,
        matchScore: '100% Match',
        items: [
            { id: 'a1', src: 'images/landscape.png', size: '4.2 MB', date: '2023-10-15 14:30', isPrimary: true },
            { id: 'a2', src: 'images/landscape.png', size: '4.2 MB', date: '2023-10-15 14:30', isPrimary: false }
        ]
    },
    {
        id: 2,
        matchScore: '98% Visual Match',
        items: [
            { id: 'b1', src: 'images/portrait.png', size: '3.8 MB', date: '2023-09-22 09:15', isPrimary: true },
            { id: 'b2', src: 'images/portrait.png', size: '1.2 MB', date: '2023-09-22 09:16', isPrimary: false } // Simulating a compressed copy
        ]
    }
];

function renderDuplicates() {
    const container = document.getElementById('duplicateList');
    if (!container) return;

    if (duplicateSets.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 48px;">No duplicates found! Great job.</div>`;
        return;
    }

    container.innerHTML = duplicateSets.map(group => `
        <div class="duplicate-group" id="group-${group.id}">
            <div class="group-header">
                <div class="group-title">
                    Set #${group.id}
                    <span class="match-score">${group.matchScore}</span>
                </div>
                <button class="btn btn-primary" onclick="resolveGroup(${group.id})">Auto-Resolve</button>
            </div>
            <div class="comparison-row">
                ${group.items.map(item => `
                    <div class="photo-candidate ${item.isPrimary ? 'selected' : ''}" id="item-${item.id}">
                        ${item.isPrimary ? '<div class="badge-primary">Primary</div>' : ''}
                        <img src="${item.src}" alt="Candidate">
                        <div style="margin-top: 8px; font-size: 0.85rem; color: var(--text-muted);">
                            <div>${item.size}</div>
                            <div>${item.date}</div>
                        </div>
                        <div class="candidate-actions">
                            ${!item.isPrimary ? `
                                <button class="btn btn-danger" onclick="markForDeletion('${item.id}')">Delete</button>
                            ` : `<button class="btn btn-outline" disabled>Keep</button>`}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function markForDeletion(itemId) {
    const el = document.getElementById(`item-${itemId}`);
    if (el) {
        el.classList.add('rejected');
        const btn = el.querySelector('.btn-danger');
        if (btn) {
            btn.textContent = 'Undo';
            btn.onclick = () => undoDeletion(itemId);
        }
    }
}

function undoDeletion(itemId) {
    const el = document.getElementById(`item-${itemId}`);
    if (el) {
        el.classList.remove('rejected');
        const btn = el.querySelector('.btn-danger');
        if (btn) {
            btn.textContent = 'Delete';
            btn.onclick = () => markForDeletion(itemId);
        }
    }
}

function resolveGroup(groupId) {
    const group = document.getElementById(`group-${groupId}`);
    if (group) {
        group.style.opacity = '0';
        setTimeout(() => {
            group.remove();
            // Check if empty
            if (document.querySelectorAll('.duplicate-group').length === 0) {
                document.getElementById('duplicateList').innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 48px;">All duplicates resolved!</div>`;
                document.querySelector('main div div[style*="text-muted"]').textContent = "Found 0 Sets";
            }
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', renderDuplicates);
