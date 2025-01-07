import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

function AIChat() {
  const [messages, setMessages] = useState([]); // Stores the chat history
  const [input, setInput] = useState(''); // Stores the current user input

  // Function to send a message to the AI
  const sendMessage = async () => {
    if (!input.trim()) return; // Ignore empty messages

    // Add the user's message to the chat history
    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // Send the message to the backend
      const response = await axios.post('http://localhost:5001/api/chat', {
        message: input,
      });

      // Add the AI's response to the chat history
      const aiMessage = { role: 'ai', content: response.data.choices[0].message.content };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      const errorMessage = { role: 'ai', content: 'Failed to get a response from the AI.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setInput(''); // Clear the input field
  };

  return (
    <Box sx={{ maxWidth: '100%', height: '400px', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
        AI Chat
      </Typography>

      {/* Chat Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <Paper
                sx={{
                  p: 1.5,
                  bgcolor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                  borderRadius: msg.role === 'user' ? '10px 10px 0 10px' : '10px 10px 10px 0',
                }}
              >
                <ListItemText primary={msg.content} />
              </Paper>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, borderTop: '1px solid #ddd', display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button variant="contained" onClick={sendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default AIChat;