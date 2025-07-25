# Project Operation Guide

## Overview

This project demonstrates an event-driven system using RabbitMQ (message queue), Keycloak (identity provider), and Node.js (producer/consumer), all orchestrated with Docker Compose.  
It features secure federated login, token validation, and Zero Trust access control with three distinct user roles.

---

## 1. Prerequisites

- Docker & Docker Compose installed
- Postman (or any HTTP client) for testing login
- Keycloak admin access for user management

---

## 2. Start All Services

In the project root directory, run:

```bash
docker-compose up --build
```

This will start:
- **RabbitMQ** (message queue, management UI at [http://localhost:15672](http://localhost:15672), user: guest/guest)
- **Keycloak** (identity provider, admin UI at [http://localhost:8080](http://localhost:8080), user: admin/admin, persistent data)
- **Producer** (Node.js service, provides HTTP API for user login at [http://localhost:3000/login])
- **Consumer** (Node.js service, receives and validates messages from RabbitMQ)

---

## 3. Keycloak Setup (Required)

Before testing, you need to configure users and roles in Keycloak:

1. **Access Keycloak Admin Console**: http://localhost:8080 (admin/admin)
2. **Create Roles**:
   - `admin` - Full access to publish events
   - `publisher` - Can publish events  
   - `user` - Read-only access, cannot publish events
3. **Create Users** and assign appropriate roles:
   - Admin user with `admin` role
   - Publisher user with `publisher` role
   - Regular user with `user` role

---

## 4. How It Works

### Access Control Strategy (Zero Trust Principles):
- **Admin Role**: Highest privileges, can publish all events
- **Publisher Role**: Secondary privileges, can publish events
- **User Role**: Limited access, cannot publish events (demonstrates access denial)

### Event Flow:
1. **User Login**: Send POST request to `http://localhost:3000/login` with username and password
2. **Producer**: 
   - Validates credentials with Keycloak
   - Retrieves JWT token with user roles
   - **Zero Trust Check**: Validates user has required roles (admin or publisher)
   - Sends login event (with token) to RabbitMQ if authorized
3. **Consumer**: 
   - Receives the event from RabbitMQ
   - **Zero Trust Validation**: Validates the token with Keycloak introspection
   - Processes the event only if token is valid
   - Prints detailed results showing Zero Trust principles in action

---

## 5. Testing the System

### Test Different User Roles:

```bash
# Test Admin User (should succeed)
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Test Publisher User (should succeed)  
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"publisher","password":"password"}'

# Test Regular User (should be denied - demonstrates Zero Trust)
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"password"}'
```

### Expected Results:
- **Admin/Publisher**: Login successful, event published to queue
- **User**: Access denied with 403 error (Zero Trust access control)
- **Consumer**: Shows token validation and Zero Trust processing

---

## 6. Zero Trust Principles Demonstrated

1. **Never Trust, Always Verify**: Every login attempt is validated against Keycloak
2. **Role-Based Access Control**: Different user roles have different permissions
3. **Token Validation**: JWT tokens are introspected for every event
4. **Continuous Verification**: Each message in the queue is validated before processing
5. **Least Privilege**: Users only get access to what they need based on their role

---

## 7. Project Structure

- `docker-compose.yml` — Orchestrates all services and persistent volumes
- `producer/` — Node.js producer code (HTTP API for login with role-based access control)
- `consumer/` — Node.js consumer code (event processing with Zero Trust token validation)
- `Project Instruction.md` — This comprehensive setup and testing guide
- `README.md` — Project summary and requirements

---

## 8. Demo Features

**Event-Driven Architecture**: RabbitMQ message queue with producer/consumer pattern  
**Federated Identity**: Keycloak integration for secure authentication  
**User Login Flows**: HTTP API for user authentication  
**Token Validation**: JWT token generation and introspection  
**Zero Trust Access Control**: Three-tier role-based access policy  
**Docker Compose**: Complete containerized deployment  
**Real-time Event Processing**: Live demonstration of event pipeline
