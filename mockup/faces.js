const faces = [
    { id: 1, name: 'Alex', count: 142, src: 'images/group_photo_4_faces.png', position: '20% 25%' },
    { id: 2, name: 'Sarah', count: 89, src: 'images/portrait.png', position: '55% 30%' }, 
    { id: 3, name: 'Grandma', count: 56, src: 'images/portrait.png', position: '50% 50%' },
    { id: 4, name: 'Michael', count: 34, src: 'images/portrait.png', position: '50% 50%' },
    { id: 5, name: 'Sam', count: 12, src: 'images/group_photo_4_faces.png', position: '40% 25%' }
];

function renderFaces() {
    const grid = document.getElementById('facesGrid');
    if (!grid) return;

    grid.innerHTML = faces.map(person => `
        <div class="face-card" onclick="alert('Viewing photos of ' + '${person.name}')">
            <div class="face-avatar">
                <img src="${person.src}" alt="${person.name}" style="object-position: ${person.position || 'center'};">
            </div>
            <div class="face-name">${person.name}</div>
            <div class="face-count">${person.count} photos</div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderFaces);
