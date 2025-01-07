import React from 'react';
import { Typography } from '@mui/material';

function Header() {
  return (
    <div style={{ marginBottom: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1">
        Welcome back, Ed Roh
      </Typography>
    </div>
  );
}

export default Header;