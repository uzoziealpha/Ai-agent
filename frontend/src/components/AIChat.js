import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText, Select, MenuItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function AIChat({ files }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedFileId, setSelectedFileId] = useState('');

  useEffect(() => {
    if (files.length > 0) {
      alert('New file received!');
    }
  }, [files]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await axios.post('http://localhost:5001/api/chat', {
        message: input,
        file_id: selectedFileId,
      });

      const aiMessage = { role: 'ai', content: response.data.choices[0].message.content };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      const errorMessage = { role: 'ai', content: 'Failed to get a response from the AI.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setInput('');
  };

  const deleteMessage = (index) => {
    setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6">AI Chat</Typography>
      <Box>
        <Select
          value={selectedFileId}
          onChange={(e) => setSelectedFileId(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>Select a file to analyze</MenuItem>
          {files.map((file) => (
            <MenuItem key={file.file_id} value={file.file_id}>
              {file.filename}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <Paper sx={{ p: 1.5 }}>
                <ListItemText primary={msg.content} />
                <IconButton onClick={() => deleteMessage(index)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Paper>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={sendMessage}>Send</Button>
      </Box>
    </Box>
  );
}

export default AIChat;