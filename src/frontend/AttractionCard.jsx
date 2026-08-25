import React, { useState } from 'react';
import { MapPin, Bookmark, Navigation, Share2, Landmark, Trees, Building2, Eye, Compass, Clock, Phone, Globe, Ticket, ChevronDown, ChevronUp } from 'lucide-react';

export default function AttractionCard({ place, isSaved, onSave, onHover }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTickets, setShowTickets] = useState(false);

  const props = place.properties || {};
  const coordinates = place.geometry?.coordinates || [props.lon, props.lat];
  const lon = coordinates[0];
  const lat = coordinates[1];

  const name = props.name || 'Tourist Sight';
  const description = props.description;
  const address = props.formatted;
  const categories = props.categories || [];

  // Map categories to dynamic styling and icons
  const getCategoryTheme = () => {
    const catStr = categories.join(' ').toLowerCase();
    if (catStr.includes('park') || catStr.includes('nature')) {
      return { label: 'Nature & Park', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 shadow-sm shadow-emerald-100', icon: Trees };
    }
    if (catStr.includes('museum') || catStr.includes('arts')) {
      return { label: 'Museum & Culture', bg: 'bg-amber-50 text-amber-700 border-amber-200/60 shadow-sm shadow-amber-100', icon: Building2 };
    }
    if (catStr.includes('historic') || catStr.includes('castle')) {
      return { label: 'Historic Site', bg: 'bg-rose-50 text-rose-700 border-rose-200/60 shadow-sm shadow-rose-100', icon: Landmark };
    }
    if (catStr.includes('viewpoint')) {
      return { label: 'Viewpoint', bg: 'bg-sky-50 text-sky-700 border-sky-200/60 shadow-sm shadow-sky-100', icon: Eye };
    }
    return { label: 'Landmark', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60 shadow-sm shadow-indigo-100', icon: Compass };
  };

  const theme = getCategoryTheme();
  const IconComponent = theme.icon;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(googleMapsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate deterministic mock tickets based on categories for worldwide support
  const generateTicketInfo = () => {
    const catStr = categories.join(' ').toLowerCase();
    const requiresTickets = catStr.includes('museum') || catStr.includes('castle') || 
                            catStr.includes('zoo') || catStr.includes('aquarium') || 
                            catStr.includes('theme_park') || catStr.includes('gallery') || props.fee === 'yes';

    if (!requiresTickets) {
      if (catStr.includes('park') || catStr.includes('nature') || catStr.includes('beach') || catStr.includes('viewpoint')) {
         return { required: false, free: true };
      }
      return null;
    }

    // Deterministic price based on name string length to ensure consistency
    const basePrice = (name.length % 4) * 5 + 15; // 15, 20, 25, or 30
    
    if (catStr.includes('theme_park') || catStr.includes('zoo')) {
       return { required: true, adult: basePrice + 25, child: basePrice + 10 };
    }
    
    return { required: true, adult: basePrice, child: Math.floor(basePrice / 2) };
  };

  const ticketInfo = generateTicketInfo();

  return (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className="group bg-white hover:bg-[#FFF9F5] border border-stone-200/60 hover:border-orange-300 rounded-[1.5rem] p-5 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(234,88,12,0.08)] hover:-translate-y-1 relative"
    >
      {/* Top Badge & Save Button */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${theme.bg}`}>
          <IconComponent className="w-3.5 h-3.5" />
          {theme.label}
        </span>
        <button
          onClick={onSave}
          className={`p-2 rounded-full transition-all duration-300 ${
            isSaved 
              ? 'bg-orange-100 text-orange-600 shadow-sm shadow-orange-100' 
              : 'text-stone-400 hover:text-orange-600 hover:bg-stone-100'
          }`}
          title={isSaved ? 'Remove from Trip' : 'Save to Trip'}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-orange-600' : ''}`} />
        </button>
      </div>

      {/* Attraction Title */}
      <h3 className="font-extrabold text-stone-800 text-lg leading-snug group-hover:text-orange-700 transition-colors">
        {name} 
      </h3>

      {/* Address */}
      {address && (
        <p className="text-sm text-slate-500 mt-1.5 flex items-start gap-1.5">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2 leading-relaxed">{address}</span> 
        </p>
      )}

      {/* Optional Description (Do not render empty container) */}
      {description && ( 
        <div className="mt-3 text-sm text-stone-600 bg-[#FFF9F5] p-3.5 rounded-2xl border border-stone-100 shadow-inner">
          <p className={`leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>{description}</p> 
          {description.length > 90 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-orange-600 text-xs font-bold mt-2 hover:text-orange-800 hover:underline transition-colors"
            >
              {expanded ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>
      )}

      {/* Info Details List */}
      {(props.opening_hours || props.website || props.contact?.website || props.contact?.phone || props.phone) && (
        <div className="mt-4 space-y-2.5 bg-white p-3.5 rounded-2xl border border-stone-100">
          {props.opening_hours && (
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <Clock className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate font-medium" title={props.opening_hours}>{props.opening_hours}</span>
            </div>
          )}
          {(props.contact?.phone || props.phone) && (
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <Phone className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate font-medium">{props.contact?.phone || props.phone}</span>
            </div>
          )}
          {(props.website || props.contact?.website) && (
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <Globe className="w-4 h-4 text-orange-500 shrink-0" />
              <a href={props.website || props.contact?.website} target="_blank" rel="noopener noreferrer" className="truncate font-medium text-orange-600 hover:text-orange-800 hover:underline transition-colors">
                {(props.website || props.contact?.website).replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Tickets Section */}
      {ticketInfo && (
        <div className="mt-4 border border-stone-100 bg-white rounded-2xl overflow-hidden relative shadow-sm">
          <button 
            onClick={() => setShowTickets(!showTickets)}
            className="w-full flex items-center justify-between p-3.5 hover:bg-[#FFF9F5] transition-colors text-sm font-bold text-stone-700 group/ticket"
          >
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-emerald-500 group-hover/ticket:scale-110 transition-transform" />
              <span>Tickets & Pricing</span>
            </div>
            {showTickets ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
          </button>
          
          <div className={`transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform origin-top ${showTickets ? 'max-h-48 opacity-100 scale-y-100 translate-y-0' : 'max-h-0 opacity-0 scale-y-95 -translate-y-4'}`}>
            <div className="p-4 bg-[#FFF9F5] border-t border-stone-100 flex flex-col gap-2.5">
              {ticketInfo.free ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-bold text-emerald-600">Free Public Entry</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center text-sm bg-white p-2.5 rounded-xl border border-stone-100 shadow-sm">
                    <span className="text-slate-600 font-medium">Adult (13+ yrs)</span>
                    <span className="font-bold text-slate-800 text-base">${ticketInfo.adult}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-white p-2.5 rounded-xl border border-stone-100 shadow-sm">
                    <span className="text-slate-600 font-medium">Child (3-12 yrs)</span>
                    <span className="font-bold text-emerald-600 text-base">${ticketInfo.child}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 text-center font-medium uppercase tracking-wider">* Mock prices generated for UI demonstration purposes</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-sm">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-orange-600 font-bold hover:text-orange-800 transition-colors bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg"
        >
          <Navigation className="w-4 h-4" /> Get Directions
        </a>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-800 font-bold transition-colors hover:bg-stone-100 px-3 py-1.5 rounded-lg"
        >
          <Share2 className="w-4 h-4" /> {copied ? 'Link Copied!' : 'Share Place'}
        </button>
      </div>
    </div>
  );
}
