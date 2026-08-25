export const mapQueryToCategories = (query) => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('museum')) {
    return 'entertainment.museum';
  } else if (lowerQuery.includes('landmark')) {
    return 'tourism.sights';
  } else if (lowerQuery.includes('monument') || lowerQuery.includes('memorial')) {
    return 'tourism.sights.memorial,tourism.sights.monument';
  } else if (lowerQuery.includes('park') || lowerQuery.includes('nature')) {
    return 'leisure.park,natural';
  } else if (lowerQuery.includes('view') || lowerQuery.includes('lookout')) {
    return 'tourism.sights.viewpoint';
  } else if (lowerQuery.includes('castle') || lowerQuery.includes('palace')) {
    return 'tourism.sights.castle,tourism.sights.palace';
  }
  
  // Default general tourism sights category
  return 'tourism.sights,tourism.attraction,entertainment.museum,leisure.park';
};

export const getCategoryColor = (categories) => {
  if (!categories || !categories.length) return '#6b7280'; // gray
  
  const categoryStr = categories.join(',');
  
  if (categoryStr.includes('museum')) return '#8b5cf6'; // purple
  if (categoryStr.includes('park') || categoryStr.includes('natural')) return '#10b981'; // green
  if (categoryStr.includes('castle') || categoryStr.includes('palace')) return '#f59e0b'; // amber
  if (categoryStr.includes('viewpoint')) return '#0ea5e9'; // light blue
  if (categoryStr.includes('memorial') || categoryStr.includes('monument')) return '#f43f5e'; // rose
  if (categoryStr.includes('sights')) return '#3b82f6'; // blue
  
  return '#6366f1'; // indigo default
};

export const getCategoryLabel = (categories) => {
  if (!categories || !categories.length) return 'Attraction';
  
  const categoryStr = categories.join(',');
  
  if (categoryStr.includes('museum')) return 'Museum';
  if (categoryStr.includes('park') || categoryStr.includes('natural')) return 'Nature & Parks';
  if (categoryStr.includes('castle') || categoryStr.includes('palace')) return 'Historic Site';
  if (categoryStr.includes('viewpoint')) return 'Viewpoint';
  if (categoryStr.includes('memorial') || categoryStr.includes('monument')) return 'Monument';
  if (categoryStr.includes('sights') || categoryStr.includes('attraction')) return 'Landmark';
  
  return 'Point of Interest';
};
