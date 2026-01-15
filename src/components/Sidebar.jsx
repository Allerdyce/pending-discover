import React, { useMemo } from 'react';
import {
    Trophy, Clock, BadgeDollarSign, MapPin, Search, Sparkles,
    Users, Mars, Venus, Circle, SlidersHorizontal
} from 'lucide-react';

const Sidebar = ({ filters, setFilters }) => {
    // Helper to update filters
    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const toggleArrayFilter = (key, value) => {
        setFilters(prev => {
            const arr = prev[key] || [];
            if (arr.includes(value)) {
                return { ...prev, [key]: arr.filter(v => v !== value) };
            }
            return { ...prev, [key]: [...arr, value] };
        });
    };

    return (
        <aside className="hidden lg:block lg:col-span-1" style={{ maxWidth: '310px' }}>
            {/* Type of Activity */}
            <div className="bg-white rounded-2xl border border-slate-200 mb-6 overflow-hidden">
                <div className="p-3">
                    <label className="text-xs font-semibold text-slate-600 uppercase">Type of Activity</label>
                    <div className="mt-2 relative">
                        <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#222222] pointer-events-none" />
                        <select
                            className="w-full appearance-none border border-slate-200 rounded-xl px-2 py-3 pl-10 pr-9 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                            value={filters?.activityType || 'leagues'}
                            onChange={(e) => updateFilter('activityType', e.target.value)}
                        >
                            <option value="leagues">Leagues</option>
                            <option value="tournaments">Tournaments</option>
                            <option value="daily-sports">Daily Sports</option>
                            <option value="events">Events</option>
                            <option value="private-rentals">Private Rentals</option>
                            <option value="volunteering">Volunteering</option>
                            <option value="classes">Classes</option>
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">▾</span>
                    </div>
                </div>
            </div>

            {/* Map Preview - Unhidden per parity request */}
            <div className="bg-white p-0 rounded-2xl border border-slate-200 mb-6 overflow-hidden">
                <div className="h-40 bg-gray-200 flex items-center justify-center cursor-pointer relative group">
                    <img
                        src="https://www.google.com/maps/vt/data=..." // Placeholder or real static map
                        alt="Map Preview"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <button className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-white px-4 py-2 rounded-full text-sm font-bold shadow-sm">View Map</span>
                    </button>
                </div>
                <div className="p-3">
                    <button className="w-full text-blue-600 font-bold text-sm text-center">
                        View in a map
                    </button>
                </div>
            </div>

            <div id="filters-form" className="space-y-0 p-0 bg-transparent">
                {/* Scope Explainer (keep default league copy; update label only) */}
                {(() => {
                    const type = (filters?.activityType || 'leagues');
                    const meta = {
                        'leagues': { Icon: Trophy, title: 'Leagues', desc: 'Weekly games and playoffs. Sign up solo, with friends, or a full team — we guarantee a game every week.' },
                        'tournaments': { Icon: Trophy, title: 'Tournaments', desc: 'Single-day competitions with multiple games — big energy in one day.' },
                        'daily-sports': { Icon: Clock, title: 'Daily Sports', desc: 'Drop-ins and pickups you can join on your schedule — no season-long commitment.' },
                        'events': { Icon: Sparkles, title: 'Events', desc: 'Happy hours and social events — come for the vibes, stay for the people.' },
                        'private-rentals': { Icon: BadgeDollarSign, title: 'Private Rentals', desc: 'Reserve space for your crew — a private way to play.' },
                        'volunteering': { Icon: Users, title: 'Volunteering', desc: 'Give back and meet great people — volunteer opportunities around the community.' },
                        'classes': { Icon: Users, title: 'Classes', desc: 'Skill-building sessions and clinics — learn, improve, and have fun.' }
                    };
                    const entry = meta[type] || meta['leagues'];
                    const Icon = entry.Icon;
                    return (
                        <div className="pb-4">
                            <div className="w-full flex items-center justify-between py-2">
                                <div className="flex items-center gap-2">
                                    <Icon className="h-5 w-5 text-[#222222]" />
                                    <h4 className="font-semibold text-lg">{entry.title}</h4>
                                </div>
                            </div>
                            <div className="text-sm text-gray-700 leading-relaxed">{entry.desc}</div>
                        </div>
                    );
                })()}

                {/* Schedule */}
                <div className="py-2">
                    <div className="w-full flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-[#222222]" />
                            <h4 className="font-semibold text-lg">Schedule</h4>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h5 className="text-sm font-medium">Day of the Week</h5>
                            <div className="mt-2 flex flex-nowrap gap-2 overflow-x-auto no-scrollbar pb-1">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                                    const value = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
                                    const isChecked = filters?.days?.includes(value);
                                    return (
                                        <label key={i} className="cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={isChecked}
                                                onChange={() => toggleArrayFilter('days', value)}
                                            />
                                            <span className="inline-block px-3 py-1.5 rounded-full border border-[#818494] text-sm text-black peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 transition-colors">
                                                {day}
                                            </span>
                                        </label>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price & Deals */}
                <div className="py-2">
                    <div className="w-full flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                            <BadgeDollarSign className="h-5 w-5 text-[#222222]" />
                            <h4 className="font-semibold text-lg">Price & Deals</h4>
                        </div>
                    </div>
                    <div className="pb-3 space-y-4">
                        <div>
                            <h5 className="text-sm font-medium">Show Prices For:</h5>
                            <div className="mt-2 flex flex-nowrap gap-2 overflow-x-auto no-scrollbar pb-1">
                                {['Member', 'Free agent', 'Team'].map((type) => {
                                    const val = type.toLowerCase().replace(' ', '_');
                                    const isChecked = filters?.priceType === val;
                                    return (
                                        <label key={type} className="cursor-pointer">
                                            <input
                                                type="radio"
                                                name="price-type"
                                                className="sr-only peer"
                                                checked={isChecked}
                                                onChange={() => updateFilter('priceType', val)}
                                            />
                                            <span className="inline-block whitespace-nowrap px-3 py-1.5 rounded-full border border-[#818494] text-sm text-black peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 transition-colors">
                                                {type}
                                            </span>
                                        </label>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Simple Deal Checkboxes */}
                        <div className="mt-2 space-y-2">
                            {['Discounted Events', 'Early Bird Pricing', 'Free for Volo Pass Members'].map((deal) => (
                                <label key={deal} className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="accent-blue-600 w-4 h-4 border border-[#818494] rounded-sm"
                                        checked={filters?.priceDeals?.includes(deal)}
                                        onChange={() => toggleArrayFilter('priceDeals', deal)}
                                    />
                                    <span className="ml-2 text-sm">{deal}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="py-2">
                    <div className="w-full flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-[#222222]" />
                            <h4 className="font-semibold text-lg">Location</h4>
                        </div>
                    </div>
                    <div className="pb-3 space-y-4">
                        <div>
                            <h5 className="text-sm font-medium">Venues</h5>
                            <div className="relative mt-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#222222] pointer-events-none" />
                                <input
                                    type="text"
                                    className="w-full border border-slate-200 rounded-xl px-2 py-3 pl-10 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    placeholder="Search venue name"
                                    value={filters?.venue || ''}
                                    onChange={(e) => updateFilter('venue', e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <h5 className="text-sm font-medium">Neighborhood</h5>
                            <div className="relative mt-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#222222] pointer-events-none" />
                                <input
                                    type="text"
                                    className="w-full border border-slate-200 rounded-xl px-2 py-3 pl-10 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    placeholder="Search neighborhood"
                                    value={filters?.neighborhood || ''}
                                    onChange={(e) => updateFilter('neighborhood', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Program Highlights */}
                <div className="py-2">
                    <div className="w-full flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-[#222222]" />
                            <h4 className="font-semibold text-lg">Program Highlights</h4>
                        </div>
                    </div>
                    <div className="pb-3 space-y-2">
                        {['Bar on Site', 'Bar Tab Challenge', 'City Championship', 'Club Volo Tournament Series', 'GLOW', 'Happy Hour'].map((hl) => (
                            <label key={hl} className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="accent-blue-600 w-4 h-4 border border-[#818494] rounded-sm"
                                    checked={filters?.highlights?.includes(hl)}
                                    onChange={() => toggleArrayFilter('highlights', hl)}
                                />
                                <span className="ml-2 text-sm">{hl}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Player & Team Type */}
                <div className="py-2">
                    <div className="w-full flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-[#222222]" />
                            <h4 className="font-semibold text-lg">Player & Team Type</h4>
                        </div>
                    </div>
                    <div className="pb-3 space-y-4">
                        <div>
                            <h5 className="text-sm font-semibold">Team Composition</h5>
                            <div className="mt-2 grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Coed', Icon: Users, val: 'Coed' },
                                    { label: "Men's", Icon: Mars, val: "Men's" }, // Escape issue check
                                    { label: 'Open', Icon: Circle, val: 'Open' },
                                    { label: "Women's", Icon: Venus, val: "Women's" } // Escape issue check
                                ].map(({ label, Icon, val }) => {
                                    const isChecked = filters?.composition?.includes(val);
                                    return (
                                        <label key={val} className="block cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={isChecked}
                                                onChange={() => toggleArrayFilter('composition', val)}
                                            />
                                            <div className="rounded-xl border border-gray-300 p-4 text-center transition peer-checked:border-blue-600 peer-checked:bg-blue-50">
                                                <Icon className="mx-auto h-6 w-6 text-gray-500 peer-checked:text-blue-600" />
                                                <div className="mt-2 text-sm font-medium text-gray-800 peer-checked:text-blue-700">{label}</div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                            <p className="mt-2 text-xs text-gray-500">Coed has gender specific roster requirements Open does not.</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
