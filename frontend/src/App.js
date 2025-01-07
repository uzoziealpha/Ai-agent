import React from 'react';
import { Grid, Box } from '@mui/material';
import Header from './components/Header';
import MetricsCard from './components/MetricsCard';
import RecentTransactions from './components/RecentTransactions';
import Charts from './components/Charts';
import Sidebar from './components/Sidebar';
import AIChat from './components/AIChat'; // Import the AIChat component

function App() {
  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={2}>
          <Sidebar />
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={10}>
          {/* Header */}
          <Header />

          {/* Metrics Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricsCard title="Emails Sent" value="12,361" change="+2.6%" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricsCard title="Sales Obtained" value="43,225" change="+22%" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricsCard title="New Clients" value="32,441" change="+3%" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricsCard title="Traffic Received" value="1,225,134" change="+2%" />
            </Grid>
          </Grid>

          {/* Charts and Recent Transactions */}
          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            <Grid item xs={12} md={8}>
              <Charts />
            </Grid>
            <Grid item xs={12} md={4}>
              <RecentTransactions />
            </Grid>
          </Grid>

          {/* AI Chat */}
          <Grid item xs={12} sx={{ marginTop: '20px' }}>
            <AIChat />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;