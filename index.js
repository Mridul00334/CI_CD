
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 6001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Secret token for verifying GitHub webhook (optional but recommended)
const SECRET_TOKEN = 'your_secret_token_here';

// Path to your bash script
const BASH_SCRIPT_PATH = '/host/ubuntu/deploy_docker.sh';  // Path inside the container


// Webhook route
app.post('/webhook/admin-backend', (req, res) => {
  // Verify the webhook signature (optional but recommended for security)
  const signature = req.headers['x-hub-signature-256'];

  // Optionally, you can validate the signature here using your secret token
  // This is not implemented here for simplicity, but you can add it.

  // Check if it's a 'push' event from GitHub
  if (req.headers['x-github-event'] === 'push') {
    console.log('Push event received');
    
    // Execute the bash script when a push event is received
    exec(BASH_SCRIPT_PATH, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error}`);
        return res.status(500).send('Internal Server Error');
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      res.status(200).send('Webhook received and bash script executed');
    });
  } else {
    res.status(200).send('Event not handled');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Webhook listener running on port ${PORT}`);
});
