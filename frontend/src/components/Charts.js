import React from 'react';
import { Typography } from '@mui/material'; // Add this import
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Charts() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [50000, 60000, 70000, 80000, 90000, 100000],
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Revenue Generated
      </Typography>
      <Line data={data} />
    </div>
  );
}

export default Charts;