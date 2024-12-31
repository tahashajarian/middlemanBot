const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Handle incoming Telegram updates
app.post('/webhook', (req, res) => {
  console.log(req.body);
  res.sendStatus(200); // Acknowledge Telegram that the request was received
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
