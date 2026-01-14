import React from 'react';
import { Users, Mars, Venus, Circle, MapPin, Clock, Info } from 'lucide-react';

const Card = ({ activity }) => {
    // Helper to safely get nested properties
    const getProp = (obj, path, fallback) => {
        return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : undefined, obj) || fallback;
    };

    const programName = activity.program_name || "Activity";
    const venueName = activity.venue_name || "Unknown Venue";
    const image = activity.image_url || "/images/missingimage.jpg";

    // Logic for icons
    const format = activity.format || "";
    let GenderIcon = Users; // Default Coed
    if (format.toLowerCase().includes('men') && !format.toLowerCase().includes('women')) GenderIcon = Mars;
    if (format.toLowerCase().includes('women')) GenderIcon = Venus;
    if (format.toLowerCase().includes('open')) GenderIcon = Circle;

    // Price Logic
    const priceMember = activity.member_price_current || 0;
    const priceGuest = activity.price_person_current || 0;
    const priceDisplay = priceMember > 0 ? priceMember : priceGuest;
    const isMemberPrice = priceMember > 0;

    // Date Logic
    const startDate = activity.start_date_text || "TBD";
    const weeks = activity.weeks || 7;
    const timeRange = `${activity.time_start || ""} - ${activity.time_end || ""}`;

    return (
        <article className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
            {/* Image Section */}
            <div className="relative h-52 shrink-0 overflow-hidden group">
                <img
                    src={image}
                    alt={activity.image_alt || programName}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="img-bottom-gradient"></div>

                {/* Overlays */}
                <div className="absolute top-4 right-4 flex gap-1">
                    {/* Activity Type Pill Placeholder */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
                        <Info className="w-4 h-4 text-blue-600" />
                    </div>
                </div>

                <div className="absolute bottom-4 left-6 right-6">
                    <h3 className="overlay-title font-volo-pro font-black uppercase text-xl leading-none text-white drop-shadow-md">
                        {programName}
                    </h3>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1 p-5 pt-4">

                {/* Location */}
                <div className="flex items-start gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                        <div className="font-extrabold text-[15px] leading-tight text-gray-900">
                            {venueName}
                        </div>
                        <div className="text-xs text-gray-500 font-medium mt-0.5">
                            {/* Neighborhood placeholder if available */}
                            Baltimore
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-200 border-b mb-3">
                    {/* Composition */}
                    <div className="flex flex-col items-center justify-center text-center p-1">
                        <GenderIcon className="w-5 h-5 text-gray-600 mb-1" />
                        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">
                            {format.split(' ')[0] || "Coed"}
                        </span>
                    </div>
                    {/* Skill */}
                    <div className="flex flex-col items-center justify-center text-center p-1 border-l border-r border-slate-100">
                        <TrophyIcon level={activity.skill_levels?.[0]} />
                        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight truncate w-full">
                            {activity.skill_levels?.[0] || "Rec"}
                        </span>
                    </div>
                    {/* Format */}
                    <div className="flex flex-col items-center justify-center text-center p-1">
                        <Users className="w-5 h-5 text-gray-600 mb-1" />
                        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">
                            {format.match(/\d+v\d+/) || "Team"}
                        </span>
                    </div>
                </div>

                {/* Schedule */}
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-4 px-1">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-gray-900">{startDate}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-400">•</span>
                    <span className="text-xs font-medium">{weeks} Weeks</span>
                </div>

                {/* Footer: Price & CTA */}
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-gray-900">${Math.floor(priceDisplay)}</span>
                            <span className="text-xs font-bold text-gray-500">
                                {isMemberPrice ? "/member" : "/guest"}
                            </span>
                        </div>
                        {isMemberPrice && (
                            <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">
                                Save ${Math.floor(priceGuest - priceMember)}
                            </div>
                        )}
                    </div>

                    <button className="bg-white border border-slate-200 hover:bg-slate-50 hover:border-blue-200 text-slate-700 hover:text-blue-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-colors">
                        More Info
                    </button>
                </div>

            </div>
        </article>
    );
};

// Helper for dynamic trophy icon based on skill
const TrophyIcon = ({ level = "" }) => {
    const l = level.toLowerCase();
    if (l.includes('competitive')) return <Users className="w-5 h-5 text-amber-500 mb-1" />; // Placeholder
    if (l.includes('social')) return <Users className="w-5 h-5 text-purple-500 mb-1" />;
    return <Users className="w-5 h-5 text-emerald-500 mb-1" />;
};

export default Card;
