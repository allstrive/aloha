// Data now loaded from mock-data.js

function renderGrid() {
    const grid = document.getElementById('photoGrid');
    if (!grid) return;

    grid.innerHTML = samplePhotos.map((photo, index) => `
        <div class="photo-card animate-fade-in" style="animation-delay: ${index * 0.05}s" onclick="window.location.href='detail.html?id=${index}'">
            <img src="${photo.src}" alt="${photo.tags.join(', ')}">
            <div class="photo-meta">
                <div class="tags">
                    ${photo.tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
                </div>
                <div style="font-size: 0.8rem; margin-top: 4px; opacity: 0.8;">${photo.date}</div>
            </div>
        </div>
    `).join('');
}

// Simple search simulation
document.querySelector('.search-input')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    // In a real app, this would filter. For mockup, we could just shuffle or opacity out.
    // Let's implement basic filtering
    const cards = document.querySelectorAll('.photo-card');
    cards.forEach(card => {
        const text = card.textContent.toLowerCase() + card.querySelector('img').alt.toLowerCase();
        if (text.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', renderGrid);
