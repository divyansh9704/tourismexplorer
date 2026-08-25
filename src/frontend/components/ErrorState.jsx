import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ message = "Something went wrong.", onRetry }) => {
  return (
    <div className="state-container">
      <AlertCircle size={48} className="state-icon" style={{ color: 'var(--accent-color)' }} />
      <h3>Oops!</h3>
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
