
const fs = require('fs');
const leagues = require('./public/data/leagues.json');

const items = leagues.records || leagues;
const types = new Set();
const activityTypes = new Set();

items.forEach(i => {
    if (i.type) types.add(i.type);
    if (i.activity_type) activityTypes.add(i.activity_type);
});

console.log("Unique 'type' values:", Array.from(types));
console.log("Unique 'activity_type' values:", Array.from(activityTypes));

// Also check for any item that might look like a rental by features
const rentalFeatures = items.filter(i => {
    const feats = (i.features || []).join(' ').toLowerCase();
    return feats.includes('rental') || feats.includes('private');
});
console.log("Items with 'rental' or 'private' in features:", rentalFeatures.length);
