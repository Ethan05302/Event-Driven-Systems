# Event-Driven Systems Using Cloud-Native Messaging

## Basic Information

- **Date**: July 28, 2025  
- **Duration**: 1 Hour  
- **Team Members**: Martins, Jonathan, Simar Singh, Keval Trivedi, Karthik Raghavendra Urala, Zhang Zhe  

## Demo Focus

Implementing an event-driven pipeline using message queues and consumers with **Zero Trust security principles**.

**Details**:  
Set up a secure federated identity system using Keycloak. The demo includes:  
- User login flows with role-based authentication  
- JWT token validation and introspection  
- Access policies that support Zero Trust principles with three distinct user roles  

**Tools**:  
- RabbitMQ (message queue)  
- Node.js (producer/consumer services)  
- Keycloak (federated identity provider)  
- Docker Compose (container orchestration)  

## Zero Trust Access Control Implementation

### Three-Tier Role System:
1. **Admin Role** - Highest privileges, can publish all events
2. **Publisher Role** - Secondary privileges, can publish events  
3. **User Role** - Limited access, cannot publish events (demonstrates access denial)

### Zero Trust Principles Demonstrated:
- **Never Trust, Always Verify**: Every login attempt validated against Keycloak
- **Role-Based Access Control**: Different permissions based on user roles
- **Token Validation**: JWT tokens introspected for every event
- **Continuous Verification**: Each message validated before processing
- **Least Privilege**: Users only get access based on their role

## Presentation Structure

### 1. Theory Introduction (15–30 minutes)
- Basic explanation of Event-Driven Architecture, Messaging Queues, and Federated Identity
- Zero Trust security principles and their implementation

### 2. Live Demo (20 minutes)
- Show working event-driven pipeline with secure identity and access control
- Demonstrate three different user roles and their access levels
- Real-time event processing with Zero Trust validation

### 3. Q&A and Interaction (10 minutes)
- Answer professor or class questions about the implementation

## System Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│  Producer   │───▶│  RabbitMQ   │───▶│  Consumer   │
│ (Postman)   │    │ (Node.js)   │    │ (Message    │    │ (Node.js)   │
└─────────────┘    └─────────────┘    │   Queue)    │    └─────────────┘
                     │                └─────────────┘           │
                     │                                         │
                     ▼                                         ▼
              ┌─────────────┐                        ┌─────────────┐
              │  Keycloak   │                        │  Keycloak   │
              │ (Identity   │                        │ (Token      │
              │  Provider)  │                        │ Validation) │
              └─────────────┘                        └─────────────┘
```

## Quick Start

1. **Clone the repository**
2. **Start services**: `docker-compose up --build`
3. **Configure Keycloak**: Create users and roles (see Project Instruction.md)
4. **Test the system**: Use the provided curl commands to test different user roles

## Submission Requirements (Due July 25)

- Final Slide  
- GitHub Repository (including all code, Docker files, and configs)  
- Demo Setup Guide (Project Instruction.md)

