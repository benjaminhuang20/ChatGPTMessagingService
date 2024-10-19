import React, { useState } from 'react';
import './App.css';
import { Button, TextField, Typography, Container, Box } from '@mui/material'; // Import Material UI components

const openaiApiKey = process.env.REACT_APP_OPENAI_KEY;

async function askChatGPT(content, PreviousList) {
  const url = 'https://api.openai.com/v1/chat/completions';

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o', 
      messages: [...PreviousList, { role: 'user', content: content }]
    })
  };

  try {
    const response = await fetch(url, options);

    const jsonData = await response.json();
    if (jsonData.choices && jsonData.choices.length > 0) {
      const reply = jsonData.choices[0].message.content;
      return reply;
    }
  } catch (error) {
    console.error('Error making the API request:', error);
  }

  return "No response"; 
}

function App() {
  const [inputText, setInputText] = useState(""); // State to manage the text input
  const [replyList, setReplyList] = useState([]); // State to store ChatGPT's responses

  const submitInputText = async (text) => {
    if (!text.trim()) {
      return;
    } // Avoid submitting empty input

    // Add user's input to the list first (role: 'user')
    setReplyList(prev => [...prev, { role: 'user', content: text }]);
    
    // Wait for ChatGPT API response
    const response = await askChatGPT(text,replyList); 

    setReplyList(prev => [...prev, { role: 'system', content: response }]);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);  // Update the state with the input value
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitInputText(inputText);
      setInputText('');  // Clear input field after submitting
    }
  };

  return (
    <Container maxWidth="md" className="App" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
    {/*Scrollable messages container */}
    <Box 
      sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        border: '1px solid #ccc', 
        padding: 2, 
        marginBottom: 2 
      }}
    >
      <Typography variant="h6">Conversation:</Typography>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {replyList.map((reply, index) => (
          <li key={index}>
            <Typography
              variant="body1"
              align={reply.role === 'user' ? "right" : "left"}
              style={{ marginBottom: '10px' }}
            >
              <strong>{reply.role === 'user' ? 'You' : 'ChatGPT'}:</strong> {reply.content}
            </Typography>
          </li>
        ))}
      </ul>
    </Box>
    
    {/* Fixed input and submit area */}
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        fullWidth
        label="Enter your text"
        variant="outlined"
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        margin="normal"
      />
      <Button 
        variant="contained"
        style={{ marginLeft: '10px', height: '56px' }}
        onClick={() => { submitInputText(inputText); setInputText(''); }}
      >
        Submit
      </Button>
    </Box>
    
  </Container>
  );
}

export default App;
