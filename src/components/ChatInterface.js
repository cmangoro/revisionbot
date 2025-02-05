import React, { useState } from 'react';
import axios from 'axios';

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSendMessage = async () => {
    try {
      const result = await axios.post('/api/chat', { message });
      setResponse(result.data[0].generated_text);
    } catch (error) {
      console.error('Error communicating with the AI:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
      <div>{response}</div>
    </div>
  );
};

export default ChatInterface; // Ensure this line is present