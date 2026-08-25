import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { withHD } from '@hyperdart/frontend';
import TourismExplorer from './TourismExplorer';

// Wrap the main component with the HyperDart HOC
const WrappedComponent = withHD(TourismExplorer);

// Function to render the component when used outside React apps
export const renderComponent = (element, props) => {
  const root = createRoot(element);
  root.render(<WrappedComponent {...props} />);
  return root;
};

// Default export for React-based host applications
export default WrappedComponent;
