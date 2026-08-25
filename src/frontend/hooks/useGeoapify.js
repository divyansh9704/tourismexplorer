import { useState, useEffect } from 'react';
import { GEOAPIFY_API_KEY, GEOAPIFY_BASE_URL, DEFAULT_SEARCH_RADIUS, DEFAULT_LIMIT } from '../utils/constants';
import { mapQueryToCategories } from '../utils/categoryMapper';

export const useGeoapify = (searchData) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPlaces = async () => {
      // Safety check for searchData format
      if (!searchData || !searchData.entities || searchData.entities.length === 0) {
        setIsLoading(false);
        return;
      }

      const entity = searchData.entities[0];
      if (!entity.entityInfo || !entity.entityInfo.geo) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const lat = entity.entityInfo.geo.lat;
      const lon = entity.entityInfo.geo.long;
      const query = searchData.query || '';
      
      const categories = mapQueryToCategories(query);

      try {
        const url = `${GEOAPIFY_BASE_URL}?categories=${categories}&filter=circle:${lon},${lat},${DEFAULT_SEARCH_RADIUS}&bias=proximity:${lon},${lat}&limit=${DEFAULT_LIMIT}&apiKey=${GEOAPIFY_API_KEY}`;
        
        const response = await fetch(url, { method: 'GET' });
        
        if (!response.ok) {
          throw new Error(`Geoapify API Error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (isMounted) {
          // Filter out results without names
          const validFeatures = (result.features || []).filter(f => f.properties && f.properties.name);
          setData(validFeatures);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch attractions.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPlaces();

    return () => {
      isMounted = false;
    };
  }, [searchData]);

  return { data, isLoading, error };
};
