import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, List, ListItem, IconButton, ListItemText, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function FileUpload({ onUploadSuccess, onFileDelete }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(selectedFile.name);  // Set the file preview name
    }
  };

  // Handle file upload
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

      const uploadedFile = {
        file_id: response.data.file_id, // Assuming the backend returns a file ID
        filename: file.name,
      };

      setFiles((prevFiles) => [...prevFiles, uploadedFile]);
      setUploadStatus('File uploaded successfully!');
      onUploadSuccess(uploadedFile); // Notify the parent component of success

      // Clear the selected file after upload
      setFile(null);
      setFilePreview('');
    } catch (error) {
      setUploadStatus('Failed to upload file.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Delete file from list and backend
  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`http://localhost:5001/api/delete/${fileId}`);
      setFiles((prevFiles) => prevFiles.filter((file) => file.file_id !== fileId));
      onFileDelete(fileId); // Notify the parent component
    } catch (error) {
      console.error('Error deleting file:', error);
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

      {filePreview && (
        <Box sx={{ mt: 2, bgcolor: 'lightgray', p: 2, borderRadius: '8px' }}>
          <Typography variant="body2">Selected File: {filePreview}</Typography>
        </Box>
      )}

      {uploadStatus && (
        <Typography
          variant="body2"
          sx={{ mt: 2, color: uploadStatus.includes('success') ? 'green' : 'red' }}
        >
          {uploadStatus}
        </Typography>
      )}

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Uploaded Files</Typography>
        <List>
          {files.map((file) => (
            <ListItem key={file.file_id} sx={{ display: 'flex', alignItems: 'center' }}>
              <Paper sx={{ p: 1, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <ListItemText primary={file.filename} />
                <IconButton onClick={() => handleDelete(file.file_id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Paper>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default FileUpload;