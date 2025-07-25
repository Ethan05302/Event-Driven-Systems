const amqp = require('amqplib');
const axios = require('axios');

const QUEUE = 'demo_queue';

async function validateToken(token) {
  // Validate token using Keycloak introspect endpoint
  const response = await axios.post('http://keycloak:8080/realms/master/protocol/openid-connect/token/introspect', new URLSearchParams({
    client_id: 'admin-cli',
    client_secret: '5shnJhoJQxBRNvySdprfBJUzyAeRfwJz',
    token
  }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data.active;
}

async function consume() {
  const maxRetries = 10;
  const retryDelay = 2000; // 2 seconds
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting to connect to RabbitMQ (attempt ${attempt}/${maxRetries})...`);
      const conn = await amqp.connect('amqp://rabbitmq');
      const channel = await conn.createChannel();
      await channel.assertQueue(QUEUE);

      console.log('Consumer started, waiting for messages...');
      channel.consume(QUEUE, async (msg) => {
        if (msg !== null) {
          const content = JSON.parse(msg.content.toString());
          
          console.log(`\n--- Processing Login Event ---`);
          console.log(`User: ${content.data.user}`);
          console.log(`Time: ${content.data.time}`);
          console.log(`Login Success: ${content.data.loginSuccess}`);
          
          if (content.data.loginSuccess) {
            // Validate token for successful logins
            if (content.token) {
              const isValid = await validateToken(content.token);
              if (isValid) {
                console.log('Token validation: SUCCESS');
                console.log('Zero Trust access control: User authenticated and authorized');
                console.log('Event processed successfully');
              } else {
                console.log('❌ Token validation: FAILED');
                console.log('❌ Zero Trust access control: User not authorized');
              }
            } else {
              console.log('⚠️  No token provided for successful login');
            }
          } else {
            // Handle failed login
            console.log('❌ Login failed');
            if (content.data.error) {
              console.log(`Error: ${content.data.error}`);
            }
            console.log('Failed login event processed');
          }
          
          console.log('--- End of Event Processing ---\n');
          channel.ack(msg);
        }
      });
      
      // Keep the connection alive
      process.on('SIGINT', () => {
        console.log('Shutting down consumer...');
        conn.close();
        process.exit(0);
      });
      
      return; // Successfully connected and started consuming
      
    } catch (error) {
      console.error(`Failed to connect to RabbitMQ (attempt ${attempt}/${maxRetries}):`, error.message);
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        console.error('Max retries reached. Consumer failed to start.');
        process.exit(1);
      }
    }
  }
}

consume().catch(console.error); 