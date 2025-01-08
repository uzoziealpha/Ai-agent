import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file.');
      return;
    }

    setUploading(true);
    setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadStatus('File uploaded successfully!');
      onUploadSuccess(response.data);
    } catch (error) {
      setUploadStatus('Failed to upload file.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: '8px', bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        Upload Files
      </Typography>
      <input
        type="file"
        accept=".xlsx,.csv,.pdf,.docx"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button variant="contained" component="span" sx={{ mr: 2 }}>
          Choose File
        </Button>
      </label>
      <Button variant="contained" onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? <CircularProgress size={24} /> : 'Upload'}
      </Button>
      {uploadStatus && (
        <Typography
          variant="body2"
          sx={{ mt: 2, color: uploadStatus.includes('success') ? 'green' : 'red' }}
        >
          {uploadStatus}
        </Typography>
      )}
    </Box>
  );
}

export default FileUpload;