import React, { useEffect } from "react";
import { Typography } from '@mui/material';


function NewComponent(props) {
  
  useEffect(() => {
    /**
     * This callback notifies the WebSearch platform that this component
     * has fully loaded and is ready to render.
     *
     * This should be triggered only once, ideally from the
     * top-level parent component.
     *
     * Important: Invoke this only when the UI is fully ready
     * (e.g., after required API data has been loaded and the
     * primary content has rendered), not necessarily on
     * component mount.
     */
    props?.messageHandlers?.componentLoaded();
  }, []);
  return (
    <div>
      <Typography variant="caption">hyperDart New Component</Typography>
    </div>
  );
};
export default NewComponent;