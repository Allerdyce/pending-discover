
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables (or expect them to be set)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY; // or SERVICE_ROLE_KEY for writing

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Error: Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA_DIR = path.join(__dirname, '../public/data');

// Helper to parse "MM/DD" or "Month DD" to full date relative to current year
function parseDateText(text) {
    if (!text) return null;
    // This is a naive implementation; for production, use a robust library or logic matching the frontend's heavy logic
    // For now, we store the raw text mainly, but try to produce a valid timestamp if easy.
    // We'll leave `start_date` null if parsing is complex, and rely on `start_date_text`
    return null;
}

async function seedLeagues() {
    const filePath = path.join(DATA_DIR, 'leagues.json');
    if (!fs.existsSync(filePath)) return;

    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    const records = data.records || [];

    console.log(`Processing ${records.length} leagues...`);

    const mapped = records.map(r => ({
        source: 'leagues',
        program_name: r.program_name,
        venue_name: r.venue_name,
        venue_map_url: r.venue_map_url,
        neighborhood: extractNeighborhood(r.program_name, r.venue_name),
        sport: deriveSport(r.program_name),
        activity_type: 'League',

        start_date_text: r.start_date_text,
        time_start: r.time_start,
        time_end: r.time_end,
        weeks_duration: r.weeks,

        format: r.format,
        skill_levels: r.skill_levels,
        features: r.features,

        price_person_current: r.price_person_current,
        price_team: r.price_team,
        member_price_current: r.member_price_current,
        member_price_original: r.member_price_original,

        image_url: r.image_url,
        image_alt: r.image_alt,
        banner_message: r.banner_message,
        registration_phase_text: r.registration_phase_text,
        registration_ends_mmdd: r.registration_ends_mmdd,
        perks_more_url: r.perks_more_url,

        raw_data: r
    }));

    const { error } = await supabase.from('activities').insert(mapped);
    if (error) console.error("Error inserting leagues:", error);
    else console.log("Leagues inserted successfully.");
}

async function seedDailySports() {
    const filePath = path.join(DATA_DIR, 'daily-sports.json');
    if (!fs.existsSync(filePath)) return;

    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    const records = data.records || [];

    console.log(`Processing ${records.length} daily sports...`);

    const mapped = records.map(r => ({
        source: 'daily', // generalized source
        program_name: r.program_name,
        venue_name: r.venue_name,
        venue_map_url: r.venue_map_url,
        neighborhood: r.neighborhood || extractNeighborhood(r.program_name, r.venue_name),
        sport: r.sport,
        activity_type: r.activity_type, // Pickup, Drop-In

        start_date_text: null, // daily usually implies 'today'/'tomorrow' logic relative to visit
        time_start: r.time_start,
        time_end: r.time_end,

        format: r.format,
        skill_levels: r.skill_levels,
        features: r.features,

        price_person_current: r.price_person_current,
        member_price_current: r.member_price_current,
        member_price_original: r.member_price_original,

        image_url: r.image_url,
        image_alt: r.image_alt,

        raw_data: r
    }));

    const { error } = await supabase.from('activities').insert(mapped);
    if (error) console.error("Error inserting daily sports:", error);
    else console.log("Daily sports inserted successfully.");
}

// Minimal helpers based on frontend logic
function extractNeighborhood(prog, venue) {
    // Simple heuristic or hardcoded list if needed. 
    // For now, look for suffix in program name " - Canton"
    if (prog && prog.includes(' - ')) {
        const parts = prog.split(' - ');
        const last = parts[parts.length - 1].trim();
        // Verify against known list if desired, but raw extraction is fine for seed
        return last;
    }
    return null;
}

function deriveSport(prog) {
    const p = (prog || "").toLowerCase();
    if (p.includes('volleyball')) return 'Volleyball';
    if (p.includes('soccer')) return 'Soccer';
    if (p.includes('pickleball')) return 'Pickleball';
    if (p.includes('basketball')) return 'Basketball';
    if (p.includes('softball')) return 'Softball';
    if (p.includes('kickball')) return 'Kickball';
    if (p.includes('cornhole')) return 'Cornhole';
    if (p.includes('flag football')) return 'Flag Football';
    if (p.includes('bocce')) return 'Bocce';
    if (p.includes('bowling')) return 'Bowling';
    if (p.includes('skee-ball')) return 'Skee-Ball';
    return 'Other';
}

async function main() {
    await seedLeagues();
    await seedDailySports();
    // Add other files similarly (events, tournaments, classes) if needed
    console.log("Seeding complete.");
}

main();
