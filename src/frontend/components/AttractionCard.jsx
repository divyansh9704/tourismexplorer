import React from 'react';
import { MapPin } from 'lucide-react';
import { getCategoryColor, getCategoryLabel } from '../utils/categoryMapper';

const AttractionCard = ({ place }) => {
  const { properties } = place;
  
  if (!properties || !properties.name) return null;
  
  const name = properties.name;
  const address = properties.formatted || properties.address_line2 || `${properties.city || ''}, ${properties.country || ''}`;
  const categories = properties.categories || [];
  
  const badgeColor = getCategoryColor(categories);
  const badgeLabel = getCategoryLabel(categories);
  
  // Format distance if available
  const distance = properties.distance ? `${(properties.distance / 1000).toFixed(1)} km` : '';

  return (
    <a 
      href={`https://www.google.com/maps/search/?api=1&query=${properties.lat},${properties.lon}`}
      target="_blank" 
      rel="noopener noreferrer"
      className="attraction-card"
    >
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{name}</h3>
          <span 
            className="category-badge" 
            style={{ 
              backgroundColor: `${badgeColor}20`, // 20% opacity for background
              color: badgeColor 
            }}
          >
            {badgeLabel}
          </span>
        </div>
        
        <div className="card-address">
          <MapPin size={16} />
          <span>
            {address}
            {distance && <span style={{ display: 'block', marginTop: '4px', color: 'var(--text-muted)' }}>{distance} away</span>}
          </span>
        </div>
      </div>
    </a>
  );
};

export default AttractionCard;
