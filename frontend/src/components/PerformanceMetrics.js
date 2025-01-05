import React from 'react';
import { BsSpeedometer2 } from 'react-icons/bs';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

const performanceData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],  
  datasets: [
    {
      label: 'Response Time (ms)',
      data: [23, 12, 43, 28, 50, 30],  
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
  ],
};

const PerformanceMetrics = () => {
  return (
    <div>
      <h3><BsSpeedometer2 /> Performance Metrics</h3>
      <Line data={performanceData} options={{ responsive: true }} />
    </div>
  );
};

export default PerformanceMetrics;