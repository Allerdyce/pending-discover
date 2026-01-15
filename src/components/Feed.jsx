import React, { useState, useEffect } from 'react';
import Card from './Card';

const Feed = ({ filters }) => {
    const [allActivities, setAllActivities] = useState([]); // Store raw data
    const [loading, setLoading] = useState(true);

    // Initial Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [leaguesRes, eventsRes, tournamentsRes, dailyRes, rentalsRes, volunteerRes, classesRes] = await Promise.all([
                    fetch('/data/leagues.json'),
                    fetch('/data/events.json'),
                    fetch('/data/tournaments.json'),
                    fetch('/data/daily-sports.json'),
                    fetch('/data/rentals.json'),
                    fetch('/data/volunteer.json'),
                    fetch('/data/classes.json')
                ]);

                const leagues = await leaguesRes.json();
                const events = await eventsRes.json();
                const tournaments = await tournamentsRes.json();
                const daily = await dailyRes.json();
                const rentals = await rentalsRes.json();
                const volunteer = await volunteerRes.json();
                const classes = await classesRes.json();

                // Tag each record with a stable `__type` so we can filter by
                // the Type of Activity dropdown without changing existing filter logic.
                const tag = (arr, type) => (arr || []).map(r => ({ ...r, __type: type }));

                const normalizeVolunteer = (payload) => {
                    // volunteer.json is a single "card" shape, not `{ records: [] }`.
                    if (!payload) return [];
                    if (Array.isArray(payload)) return payload;
                    if (Array.isArray(payload.records)) return payload.records;
                    if (payload.card) return [payload.card];
                    return [];
                };

                const normalizeClasses = (payload) => {
                    // classes.json is `{ sections: [{ events: [...] }] }`.
                    if (!payload) return [];
                    if (Array.isArray(payload)) return payload;
                    if (Array.isArray(payload.records)) return payload.records;
                    if (Array.isArray(payload.sections)) {
                        return payload.sections.flatMap(s => Array.isArray(s.events) ? s.events : []);
                    }
                    return [];
                };

                const combined = [
                    ...tag(leagues.records || [], 'leagues'),
                    ...tag(events.records || [], 'events'),
                    ...tag(tournaments.records || [], 'tournaments'),
                    ...tag(daily.records || [], 'daily-sports'),
                    ...tag(rentals.records || [], 'private-rentals'),
                    ...tag(normalizeVolunteer(volunteer), 'volunteering'),
                    ...tag(normalizeClasses(classes), 'classes')
                ];
                setAllActivities(combined);
            } catch (err) {
                console.error("Failed to load activities", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter Logic
    const filteredActivities = allActivities.filter(activity => {
        if (!filters) return true;

        // 0. Type of Activity
        // Default to leagues to preserve current behavior.
        const selectedType = (filters.activityType || 'leagues').toLowerCase();
        if (selectedType && activity.__type) {
            if (activity.__type !== selectedType) return false;
        }

        // 1. Days Filter
        if (filters.days && filters.days.length > 0) {
            // activity.start_date_text might be "Oct 11"
            // activity.timing_raw might contain "Tuesday" or similar?
            // Legacy logic inferred DOW from date or used 'dow' field if present.
            // Let's check a record: "program_name": "Saturday - ..."
            // Simplest extraction: check if program_name includes the Day name
            const progName = (activity.program_name || "").toLowerCase();
            const matchesDay = filters.days.some(d => {
                const longDayMap = {
                    'Mon': 'monday', 'Tue': 'tuesday', 'Wed': 'wednesday',
                    'Thu': 'thursday', 'Fri': 'friday', 'Sat': 'saturday', 'Sun': 'sunday'
                };
                return progName.includes(longDayMap[d]);
            });
            if (!matchesDay) return false;
        }

        // 2. Composition (Coed, Men's, etc)
        if (filters.composition && filters.composition.length > 0) {
            // activity.format -> "Coed 7v7"
            const format = (activity.format || "").toLowerCase();
            const matchesComp = filters.composition.some(c => {
                return format.includes(c.toLowerCase());
            });
            if (!matchesComp) return false;
        }

        // 3. Location (Venue / Neighborhood)
        if (filters.venue) {
            if (!activity.venue_name?.toLowerCase().includes(filters.venue.toLowerCase())) return false;
        }
        // Neighborhood field isn't consistently in leagues.json sample, skipping precise check or mapping placeholder.

        // 4. Highlights (Features)
        if (filters.highlights && filters.highlights.length > 0) {
            const features = (activity.features || []).map(f => f.toLowerCase());
            const hasAllHighlights = filters.highlights.every(h => features.includes(h.toLowerCase()));
            if (!hasAllHighlights) return false;
        }

        // 5. Deals - Skipping for now as mapping is complex

        return true;
    });

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-96 bg-gray-100 rounded-3xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div>
            {/* Results Count Header */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
                <h2 className="text-sm font-medium">{filteredActivities.length} ways to play</h2>
                {/* Filter Pills Renderer Placeholder */}
            </div>

            {filteredActivities.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl">
                    <h3 className="text-xl font-bold text-gray-800">No activities match your filters.</h3>
                    <p className="text-gray-600 mt-2">Try removing some constraints.</p>
                    <button
                        onClick={() => window.location.reload()} // Quick hack to reset or pass reset fn
                        className="mt-4 text-blue-600 font-bold hover:underline"
                    >
                        Reset All
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start pb-20">
                    {filteredActivities.map((activity, idx) => (
                        <Card key={idx} activity={activity} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Feed;
