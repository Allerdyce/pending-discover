
const fs = require('fs');
const leagues = require('./public/data/leagues.json');

const items = leagues.records || leagues;

const courts = items.filter(l => (l.program_name || "").toLowerCase().includes("court"));
console.log("Found", courts.length, "items with 'court' in name:");
courts.forEach(c => console.log("- " + c.program_name));

const rentals = items.filter(l => (l.program_name || "").toLowerCase().includes("rental"));
console.log("\nFound", rentals.length, "items with 'rental' in name.");
