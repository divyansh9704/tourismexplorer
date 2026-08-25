import React from 'react';
import { Map } from 'lucide-react';

const EmptyState = ({ message = "No attractions found nearby." }) => {
  return (
    <div className="state-container">
      <Map size={48} className="state-icon" />
      <h3>No Results</h3>
      <p>{message}</p>
    </div>
  );
};

export default EmptyState;
