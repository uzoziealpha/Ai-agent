import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function FileLog({ files }) {
  return (
    <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: '8px', bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        Uploaded Files
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File ID</TableCell>
              <TableCell>Filename</TableCell>
              <TableCell>File Type</TableCell>
              <TableCell>Upload Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.file_id}>
                <TableCell>{file.file_id}</TableCell>
                <TableCell>{file.filename}</TableCell>
                <TableCell>{file.file_type}</TableCell>
                <TableCell>{file.upload_time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default FileLog;