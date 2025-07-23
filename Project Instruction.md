# Project Setup Guide

## Step 1: Set Up RabbitMQ

Use Docker Compose to start RabbitMQ with the management UI.  
Access the UI at http://localhost:****** and create a queue.

## Step 2: Build the Python Consumer

Write a simple Python script using `pika` to receive messages from the queue and print them.

## Step 3: Deploy Keycloak

Add Keycloak to the Docker Compose file.  
Create a realm, client, and test users (admin and user).  
Use Postman or a browser to log in and get a JWT token.

## Step 4: Validate JWT Tokens

Use PyJWT in the Python consumer to verify tokens.  
Only allow messages from users with the "admin" role.

## Step 5: Combine with Docker Compose

Add all services (RabbitMQ, Keycloak, Python consumer) to a single Docker Compose file.  
Ensure everything runs with one command.

## Step 6: Prepare for Submission

Make sure the repository includes:

- docker-compose.yml
- Python consumer script
- Keycloak setup instructions
- README.md
- Final slides 
