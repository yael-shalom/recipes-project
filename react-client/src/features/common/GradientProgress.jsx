import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f9b0a5" />
            <stop offset="100%" stopColor="#a5e0f9" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' }, alignSelf: 'center', top: '20px', position: 'relative' }} />
    </React.Fragment>
  );
}
export default function CustomizedProgressBars() {
  return (
      <GradientCircularProgress />
  );
}