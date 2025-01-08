import React, { useState } from 'react';
import { Grid, Box } from '@mui/material';
import Header from './components/Header';
import MetricsCard from './components/MetricsCard';
import RecentTransactions from './components/RecentTransactions';
import Charts from './components/Charts';
import Sidebar from './components/Sidebar';
import AIChat from './components/AIChat';
import FileUpload from './components/FileUpload';
import FileLog from './components/FileLog';

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState('');

  // Handle successful file upload
  const handleUploadSuccess = (uploadResponse) => {
    setFiles((prevFiles) => [...prevFiles, uploadResponse]);
    setSelectedFileId(uploadResponse.file_id); // Automatically select the uploaded file
  };

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
              <MetricsCard title="Files Uploaded" value={files.length} change="+12%" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricsCard title="Data Insights Generated" value="567" change="+8%" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricsCard title="Queries Processed" value="890" change="+15%" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricsCard title="Visualizations Created" value="321" change="+5%" />
            </Grid>
          </Grid>

          {/* File Upload and AI Chat */}
          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            <Grid item xs={12} md={6}>
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </Grid>
            <Grid item xs={12} md={6}>
              <AIChat files={files} selectedFileId={selectedFileId} setSelectedFileId={setSelectedFileId} />
            </Grid>
          </Grid>

          {/* File Log */}
          <Grid item xs={12} sx={{ marginTop: '20px' }}>
            <FileLog files={files} />
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
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;