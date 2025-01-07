import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function MetricsCard({ title, value, change }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4">{value}</Typography>
        <Typography variant="body2" style={{ color: change.startsWith('+') ? 'green' : 'red' }}>
          {change}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MetricsCard;