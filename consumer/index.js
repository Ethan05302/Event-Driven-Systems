const amqp = require('amqplib');
const axios = require('axios');

const QUEUE = 'demo_queue';

async function validateToken(token) {
  // Validate token using Keycloak introspect endpoint
  const response = await axios.post('http://keycloak:8080/realms/master/protocol/openid-connect/token/introspect', new URLSearchParams({
    client_id: 'admin-cli',
    client_secret: 'NiS0S2cXvdH0Z2sQt2SzRm3wIkU8fkyY',
    token
  }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data.active;
}

async function consume() {
  const conn = await amqp.connect('amqp://rabbitmq');
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE);

  console.log('Waiting for messages...');
  channel.consume(QUEUE, async (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      const isValid = await validateToken(content.token);
      if (isValid) {
        console.log('Received valid message:', content);
      } else {
        console.log('Received message with invalid token:', content);
      }
      channel.ack(msg);
    }
  });
}

consume().catch(console.error); 