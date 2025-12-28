// Data now loaded from mock-data.js

function getPhotoIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id') || '0');
}

function renderTag(tagObj, isFace = false) {
    const name = tagObj.name || tagObj; 
    const area = tagObj.area ? JSON.stringify(tagObj.area) : null;
    const clickAttr = area ? `onclick='showArea(${area}, event)' style="cursor: pointer;"` : '';
    
    return `
        <div class="editable-tag" ${clickAttr}>
            ${isFace ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' : '#'}
            ${name}
            <span class="remove">&times;</span>
        </div>
    `;
}

function showArea(area, event) {
    if (event) event.stopPropagation();
    
    const selectionBox = document.getElementById('selectionBox');
    const img = document.getElementById('mainImage');
    
    if (selectionBox && img && area) {
        const rect = img.getBoundingClientRect();
        
        // Calculate the actual displayed dimensions of the image within the element
        // (accounting for object-fit: contain)
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const containerRatio = rect.width / rect.height;
        
        let displayWidth, displayHeight, xOffset, yOffset;
        
        if (containerRatio > imgRatio) {
            // Image is pillarboxed (taller than container ratio)
            displayHeight = rect.height;
            displayWidth = displayHeight * imgRatio;
            xOffset = (rect.width - displayWidth) / 2;
            yOffset = 0;
        } else {
            // Image is letterboxed (wider than container ratio)
            displayWidth = rect.width;
            displayHeight = displayWidth / imgRatio;
            xOffset = 0;
            yOffset = (rect.height - displayHeight) / 2;
        }

        // Relative to the image stage (which should be the offsetParent)
        // We use img.offsetLeft/Top to get to the image element's start, 
        // plus correct for the object-fit centering.
        const stageX = img.offsetLeft + xOffset;
        const stageY = img.offsetTop + yOffset;

        selectionBox.style.display = 'block';
        selectionBox.style.left = (stageX + (area.x * displayWidth)) + 'px';
        selectionBox.style.top = (stageY + (area.y * displayHeight)) + 'px';
        selectionBox.style.width = (area.w * displayWidth) + 'px';
        selectionBox.style.height = (area.h * displayHeight) + 'px';
        
        setTimeout(() => {
            selectionBox.style.display = 'none';
        }, 2000);
    }
}

function renderDetail() {
    const id = getPhotoIdFromUrl();
    const photo = samplePhotos[id] || samplePhotos[0];

    // Set Image
    const img = document.getElementById('mainImage');
    if (img) img.src = photo.src;

    // Set Metadata
    document.getElementById('metaDate').textContent = photo.date;
    document.getElementById('metaLocation').textContent = photo.location;

    // Set Faces
    const facesContainer = document.getElementById('facesList');
    if (facesContainer) {
        if (photo.faces && photo.faces.length > 0) {
            facesContainer.innerHTML = photo.faces.map(face => renderTag(face, true)).join('') + 
                `<button class="editable-tag add-tag-btn">+ ID</button>`;
        } else {
            facesContainer.innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem; font-style: italic;">No faces detected</span>`;
        }
    }

    // Set Tags
    const tagsContainer = document.getElementById('tagsList');
    if (tagsContainer) {
        tagsContainer.innerHTML = photo.tags.map(tag => renderTag(tag, false)).join('') + 
            `<button class="editable-tag add-tag-btn">New</button>`;
    }
}

document.addEventListener('DOMContentLoaded', renderDetail);

// Selection & Tagging Logic
let isSelecting = false;
let startX, startY; // These will now be percentages (0.0 - 1.0)
let selectionArea = null; // Store final area for tagging
const selectionBox = document.getElementById('selectionBox');
const contextMenu = document.getElementById('contextMenu');
const imageStage = document.querySelector('.image-stage');
const img = document.getElementById('mainImage');
const imgContainer = document.querySelector('.image-container'); // Need this to compute relative to stage

// Helper to get image dimensions and offsets (Same logic as showArea)
function getImageDisplayMetrics(imgElement) {
    if (!imgElement) return null;
    const rect = imgElement.getBoundingClientRect();
    const imgRatio = imgElement.naturalWidth / imgElement.naturalHeight;
    const containerRatio = rect.width / rect.height;
    
    let displayWidth, displayHeight, xOffset, yOffset;
    
    if (containerRatio > imgRatio) {
        // Pillarboxed
        displayHeight = rect.height;
        displayWidth = displayHeight * imgRatio;
        xOffset = (rect.width - displayWidth) / 2;
        yOffset = 0;
    } else {
        // Letterboxed
        displayWidth = rect.width;
        displayHeight = displayWidth / imgRatio;
        xOffset = 0;
        yOffset = (rect.height - displayHeight) / 2;
    }
    
    // stageX/Y are relative to the offsetParent (imageStage)
    // We assume imageStage top-left aligns with imgElement top-left in the simple case, 
    // but better to rely on offsetLeft/Top if they are in same container.
    // Here we assume img is direct child of stage or aligned. 
    // Let's use img.offsetLeft/Top as the base.
    
    return {
        stageX: imgElement.offsetLeft + xOffset,
        stageY: imgElement.offsetTop + yOffset,
        width: displayWidth,
        height: displayHeight
    };
}

// Hide context menu on click elsewhere
document.addEventListener('click', (e) => {
    if (contextMenu && !contextMenu.contains(e.target) && !imageStage.contains(e.target)) {
        contextMenu.style.display = 'none';
        if (selectionBox) selectionBox.style.display = 'none';
        isSelecting = false;
    }
});

if (imageStage) {
    imageStage.addEventListener('mousedown', (e) => {
        if (e.target.closest('.context-menu')) return;
        
        const metrics = getImageDisplayMetrics(img);
        if (!metrics) return;

        // Calculate click position relative to the ACTUAL image
        const clickX = e.offsetX - (metrics.stageX - img.offsetLeft); // adjust e.offsetX which is relative to target (could be stage or img)
        // Actually, e.offsetX is tricky because target changes. 
        // Better to use Client coordinates relative to the image stage.
        
        const stageRect = imageStage.getBoundingClientRect();
        const mouseX = e.clientX - stageRect.left;
        const mouseY = e.clientY - stageRect.top;
        
        // Check if click is inside the rendered image area
        if (mouseX < metrics.stageX || mouseX > metrics.stageX + metrics.width ||
            mouseY < metrics.stageY || mouseY > metrics.stageY + metrics.height) {
            return; // Clicked outside the actual image (in the letterbox area)
        }

        isSelecting = true;
        // Store Start Coordinates as PERCENTAGES of the actual image
        startX = (mouseX - metrics.stageX) / metrics.width;
        startY = (mouseY - metrics.stageY) / metrics.height;
        
        if (selectionBox) {
            selectionBox.style.display = 'block';
            selectionBox.style.left = mouseX + 'px';
            selectionBox.style.top = mouseY + 'px';
            selectionBox.style.width = '0px';
            selectionBox.style.height = '0px';
        }
        
        if (contextMenu) contextMenu.style.display = 'none';
        e.preventDefault();
    });

    imageStage.addEventListener('mousemove', (e) => {
        if (!isSelecting || !selectionBox) return;
        
        const metrics = getImageDisplayMetrics(img);
        if (!metrics) return;

        const stageRect = imageStage.getBoundingClientRect();
        const mouseX = e.clientX - stageRect.left;
        const mouseY = e.clientY - stageRect.top;

        // Current Pct
        let currentXPct = (mouseX - metrics.stageX) / metrics.width;
        let currentYPct = (mouseY - metrics.stageY) / metrics.height;

        // Clamp to 0-1
        currentXPct = Math.max(0, Math.min(1, currentXPct));
        currentYPct = Math.max(0, Math.min(1, currentYPct));

        // Calculate Box
        const x = Math.min(startX, currentXPct);
        const y = Math.min(startY, currentYPct);
        const w = Math.abs(currentXPct - startX);
        const h = Math.abs(currentYPct - startY);

        // Convert back to pixels for display
        selectionBox.style.left = (metrics.stageX + (x * metrics.width)) + 'px';
        selectionBox.style.top = (metrics.stageY + (y * metrics.height)) + 'px';
        selectionBox.style.width = (w * metrics.width) + 'px';
        selectionBox.style.height = (h * metrics.height) + 'px';

        // Store for tagging
        selectionArea = { x: x, y: y, w: w, h: h };
    });

    imageStage.addEventListener('mouseup', (e) => {
        if (!isSelecting) return;
        isSelecting = false;
        
        if (!selectionBox || !contextMenu || !selectionArea) return;

        // Ignore small selections
        // Need to check px size
        const metrics = getImageDisplayMetrics(img);
        if (selectionArea.w * metrics.width < 10 || selectionArea.h * metrics.height < 10) {
            selectionBox.style.display = 'none';
            return;
        }
        
        // Show context menu
        const stageRect = imageStage.getBoundingClientRect();
        // Position menu at bottom-right of selection box
        const menuLeft = metrics.stageX + ((selectionArea.x + selectionArea.w) * metrics.width);
        const menuTop = metrics.stageY + ((selectionArea.y + selectionArea.h) * metrics.height);
        
        contextMenu.style.left = menuLeft + 'px';
        contextMenu.style.top = menuTop + 'px';
        contextMenu.style.display = 'block';
    });
}

window.tagSelection = function(type) {
    if (!selectionArea) return;

    // alert(`Tagging as ${type}. Area: ${JSON.stringify(selectionArea)}`); // Debug
    
    contextMenu.style.display = 'none';
    selectionBox.style.display = 'none';
    
    // Add to appropriate list
    if (type === 'face') {
        const list = document.getElementById('facesList');
        if (list) {
            const newTag = document.createElement('div');
            newTag.className = 'editable-tag';
            // Store area in onclick
            newTag.setAttribute('onclick', `showArea(${JSON.stringify(selectionArea)}, event)`);
            newTag.style.cursor = 'pointer';
            newTag.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                New Person
                <span class="remove">&times;</span>
            `;
            // Insert before the last button
            const addButton = list.querySelector('.add-tag-btn');
            if (addButton) list.insertBefore(newTag, addButton);
            else list.appendChild(newTag);
        }
    } else if (type === 'object') {
        const list = document.getElementById('tagsList');
        if (list) {
            const newTag = document.createElement('div');
            newTag.className = 'editable-tag';
            newTag.setAttribute('onclick', `showArea(${JSON.stringify(selectionArea)}, event)`);
            newTag.style.cursor = 'pointer';
            newTag.innerHTML = `
                # New Object
                <span class="remove">&times;</span>
            `;
            const addButton = list.querySelector('.add-tag-btn');
            if (addButton) list.insertBefore(newTag, addButton);
            else list.appendChild(newTag);
        }
    }

    // Reset
    selectionArea = null;
};
