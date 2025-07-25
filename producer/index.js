const amqp = require('amqplib');
const axios = require('axios');
const express = require('express');

const QUEUE = 'demo_queue';
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Store RabbitMQ channel
let channel = null;

// Initialize RabbitMQ connection with retry
async function initRabbitMQ() {
  const maxRetries = 10;
  const retryDelay = 2000; // 2 seconds
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting to connect to RabbitMQ (attempt ${attempt}/${maxRetries})...`);
      const conn = await amqp.connect('amqp://rabbitmq');
      channel = await conn.createChannel();
      await channel.assertQueue(QUEUE);
      console.log('RabbitMQ connected and queue asserted');
      return;
    } catch (error) {
      console.error(`Failed to connect to RabbitMQ (attempt ${attempt}/${maxRetries}):`, error.message);
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        console.error('Max retries reached. RabbitMQ connection failed.');
        throw error;
      }
    }
  }
}

// User login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    console.log(`User ${username} attempting to login...`);

    // Get token from Keycloak
    const tokenResponse = await axios.post('http://keycloak:8080/realms/master/protocol/openid-connect/token', new URLSearchParams({
      client_id: 'admin-cli',
      client_secret: '5shnJhoJQxBRNvySdprfBJUzyAeRfwJz',
      grant_type: 'password',
      username: username,
      password: password
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const token = tokenResponse.data.access_token;

    // Send login event message to queue
    const msg = {
      event: 'user.login',
      data: { 
        user: username, 
        time: new Date().toISOString(),
        loginSuccess: true
      },
      token
    };

    if (channel) {
      channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(msg)));
      console.log(`User ${username} login successful, message sent to queue`);
    } else {
      console.warn('RabbitMQ channel not available, message not sent');
    }

    res.json({ 
      success: true, 
      message: 'Login successful',
      token: token,
      user: username
    });

  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    
    // Send login failure event
    const msg = {
      event: 'user.login',
      data: { 
        user: req.body.username || 'unknown', 
        time: new Date().toISOString(),
        loginSuccess: false,
        error: error.response?.data?.error_description || 'Login failed'
      }
    };

    if (channel) {
      channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(msg)));
      console.log(`User ${req.body.username || 'unknown'} login failed, message sent to queue`);
    } else {
      console.warn('RabbitMQ channel not available, failure message not sent');
    }

    res.status(401).json({ 
      success: false, 
      message: 'Login failed, please check username and password',
      error: error.response?.data?.error_description || 'Authentication failed'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Producer service is running',
    rabbitmq: channel ? 'connected' : 'disconnected'
  });
});

// Start server
async function startServer() {
  try {
    await initRabbitMQ();
  } catch (error) {
    console.error('Failed to initialize RabbitMQ, but continuing with HTTP server...');
  }
  
  app.listen(PORT, () => {
    console.log(`Producer service running on port ${PORT}`);
    console.log('Waiting for user login requests...');
  });
}

startServer().catch(console.error); 