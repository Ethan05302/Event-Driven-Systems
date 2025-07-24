# Project Operation Guide

## Overview

This project demonstrates an event-driven system using RabbitMQ (message queue), Keycloak (identity provider), and Node.js (producer/consumer), all orchestrated with Docker Compose.

---

## 1. Prerequisites

- Docker & Docker Compose installed

---

## 2. Start All Services

In the project root directory, run:

```bash
docker compose up --build
```

This will start:
- **RabbitMQ** (message queue, management UI at [http://localhost:15672](http://localhost:15672), user: guest/guest)
- **Keycloak** (identity provider, admin UI at [http://localhost:8080](http://localhost:8080), user: admin/admin)
- **Producer** (Node.js service, sends a message with a JWT token and then exits)
- **Consumer** (Node.js service, receives and validates messages)

---

## 3. How It Works

- **Producer** automatically requests a token from Keycloak using the admin user, then sends a message (with token) to RabbitMQ.
- **Consumer** receives the message from RabbitMQ, validates the token with Keycloak, and prints the result in the terminal.

---

## 4. Notes

- The message queue is created automatically by the code.
- All authentication and token validation is handled via Keycloak.
- Producer currently sends one message per run and then exits. To send more messages, restart the producer service.

---

## 5. Project Structure

- `docker-compose.yml` — Orchestrates all services
- `producer/` — Node.js producer code
- `consumer/` — Node.js consumer code
- `README.md` or `Project_Operation_Guide.md` — This guide

---

## 6. Limitations (Current Version)

- No web UI for user login (producer uses admin credentials automatically)
- No role-based access control (all messages are accepted if the token is valid)
- Producer is not a persistent service

---
