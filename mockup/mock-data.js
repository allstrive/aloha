// Shared mock data for Aloha Mockup
// Used by both dashboard.js (Index) and detail.js (Detail View)

const samplePhotos = [
    { 
        src: 'images/landscape.png', 
        tags: [{name: 'Nature'}, {name: 'Mountains', area: {x: 0.2, y: 0.2, w: 0.6, h: 0.3}}, {name: 'Lake'}], 
        date: '2023-10-15', 
        location: 'Glacier National Park', 
        faces: [] 
    },
    { 
        src: 'images/portrait.png', 
        tags: [{name: 'Person'}, {name: 'Smile'}, {name: 'Park'}], 
        date: '2023-09-22', 
        location: 'Central Park', 
        faces: [
            { name: 'Sarah', area: {x: 0.45, y: 0.3, w: 0.25, h: 0.25} }, 
            { name: 'Unknown', area: {x: 0.1, y: 0.4, w: 0.15, h: 0.15} }
        ] 
    },
    { 
        src: 'images/city.png', 
        tags: [{name: 'City'}, {name: 'Night'}, {name: 'Neon'}], 
        date: '2023-11-05', 
        location: 'Tokyo', 
        faces: [] 
    },
    // Index 3: Group Photo (Now consistent across dashboard and detail)
    { 
        src: 'images/group_photo_4_faces.png', 
        tags: [{name: 'Friends'}, {name: 'Park'}], 
        date: '2023-12-01', 
        location: 'Golden Gate Park', 
        faces: [
            { name: 'Alex', area: {x: 0.15, y: 0.25, w: 0.15, h: 0.2} },
            { name: 'Sam', area: {x: 0.35, y: 0.22, w: 0.15, h: 0.2} },
            { name: 'Taylor', area: {x: 0.55, y: 0.25, w: 0.15, h: 0.2} },
            { name: 'Jordan', area: {x: 0.75, y: 0.28, w: 0.15, h: 0.2} }
        ] 
    },
    // Duplicates / Filler for grid
    { src: 'images/landscape.png', tags: [{name: 'Nature'}], date: '2023-10-15', location: 'Glacier National Park', faces: [] },
    { src: 'images/city.png', tags: [{name: 'City'}], date: '2023-11-05', location: 'Tokyo', faces: [] },
    { src: 'images/portrait.png', tags: [{name: 'Person'}], date: '2023-09-22', location: 'Central Park', faces: [{name: 'Sarah'}] },
    { src: 'images/landscape.png', tags: [{name: 'Nature'}], date: '2023-10-15', location: 'Glacier National Park', faces: [] },
    { src: 'images/portrait.png', tags: [{name: 'Person'}, {name: 'Smile'}], date: '2023-09-22', location: 'Central Park', faces: [{name: 'Sarah'}] },
];
