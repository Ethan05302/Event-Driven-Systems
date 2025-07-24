# Project Setup Guide

## Step 1: Set Up RabbitMQ

Use Docker Compose to start RabbitMQ with the management UI.  
Access the UI at http://localhost:15672.  

## Step 2: Build the Node.js Producer and Consumer

Write simple Node.js scripts using `amqplib` to send (producer) and receive (consumer) messages from the queue.  
The consumer will print received messages and validate tokens.

## Step 3: Deploy Keycloak

Add Keycloak to the Docker Compose file.  
The default realm and admin user are set up automatically.  
The producer script will automatically request a JWT token from Keycloak using the admin user.

## Step 4: Validate JWT Tokens

The consumer uses Keycloak's token introspection endpoint to verify the validity of each token.  

## Step 5: Combine with Docker Compose

Add all services (RabbitMQ, Keycloak, Node.js producer, Node.js consumer) to a single Docker Compose file.  
Ensure everything runs with one command.

## Step 6: Prepare for Submission

Make sure the repository includes:

- docker-compose.yml
- Node.js producer and consumer scripts
- README.md
- Final slides 
