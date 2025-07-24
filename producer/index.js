const amqp = require('amqplib');
const axios = require('axios');

const QUEUE = 'demo_queue';

async function sendMessage() {
  // Get Keycloak token (for demo, use admin user)
  const tokenResponse = await axios.post('http://keycloak:8080/realms/master/protocol/openid-connect/token', new URLSearchParams({
    client_id: 'admin-cli',
    client_secret: 'NiS0S2cXvdH0Z2sQt2SzRm3wIkU8fkyY',
    grant_type: 'password',
    username: 'admin',
    password: 'admin'
  }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  const token = tokenResponse.data.access_token;

  const conn = await amqp.connect('amqp://rabbitmq');
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE);

  const msg = {
    event: 'user.login',
    data: { user: 'admin', time: new Date().toISOString() },
    token
  };

  channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(msg)));
  console.log('Message sent:', msg);

  setTimeout(() => {
    conn.close();
    process.exit(0);
  }, 500);
}

sendMessage().catch(console.error); 