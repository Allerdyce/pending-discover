import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const env = {}; // import.meta.env Not reliable in static deploy without build
const supabaseUrl = 'https://qffblhrlsyztuvunkwym.supabase.co';
const supabaseKey = 'sb_publishable_3vEV1SAkB-AfoG1V3CPKDA_HG-1UFwT';

let supabase = null;

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
} else {
    console.warn("Supabase credentials not found. Data fetching will likely fail or use fallbacks.");
}

export const db = supabase;

/**
 * Fetch activities with optional filters
 * @param {Object} filters - { source, sport, activity_type, organization }
 */
export async function fetchActivitiesFromSupabase(filters = {}) {
    if (!supabase) {
        console.error("Supabase client not initialized.");
        return [];
    }

    let query = supabase.from('activities').select('*');

    if (filters.source) {
        query = query.eq('source', filters.source);
    }

    if (filters.activity_type) {
        // Handle possible array or single val if needed, simpler for now
        // query = query.eq('activity_type', filters.activity_type); 
    }

    // Add other filters as logic requires...

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching activities:", error);
        return [];
    }

    return data;
}
