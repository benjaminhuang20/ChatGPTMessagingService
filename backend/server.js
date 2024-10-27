const http = require('http');
require('dotenv').config();

const port = 3001;

// Load the OpenAI API key from the environment variables
const openaiApiKey = process.env.REACT_APP_OPENAI_KEY;

// Function to ask ChatGPT using OpenAI's API
async function askChatGPT(PreviousList) {
  const url = 'https://api.openai.com/v1/chat/completions';

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [...PreviousList]
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

// Create the server
const server = http.createServer(async function (req, res) {
  // Set the headers for the response
  res.setHeader('Content-Type', 'text/plain');

  // Route handling
  if (req.method === 'GET') {
    // Handle GET request to /something/something
    try {
      const response = await askChatGPT([{ role: 'user', content: "hello, are you sentient?" }]);
      res.write(response);
    } catch (error) {
      res.write('Error occurred while getting a response from ChatGPT');
    }
  } else {
    // If route is not /something/something, return 404
    res.statusCode = 404;
    res.write('Route not found');
  }

  res.end();
});

// Start the server
server.listen(port, function (error) {
  if (error) {
    console.log(`Something went wrong: ${error}`);
  } else {
    console.log(`Server is listening on port ${port}`);
  }
});