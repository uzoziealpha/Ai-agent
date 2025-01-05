import React, { useState } from 'react';
import { BsFillChatDotsFill } from 'react-icons/bs';

const RealTimeChat = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponse('AI is thinking...');
    // Simulate AI response
    setTimeout(() => setResponse('Hello! How can I assist you today?'), 2000);
  };

  return (
    <div>
      <h3><BsFillChatDotsFill /> Real-Time Chat</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <div>{response}</div>
    </div>
  );
};

export default RealTimeChat;