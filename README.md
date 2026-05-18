## Project Overview
Tourism Management System

Full Stack + Scalable System Design

A production-oriented tourism management platform built using the **MERN stack**, designed with **event-driven communication**, and **scalable system design principles**.


 
Overview

The Tourism Management System is a web-based application that enables users to:

* Register & authenticate securely
* Browse travel packages
* Book trips
* Generate shareable links

Unlike traditional monolithic systems, this project adopts a **distributed microservices architecture** to ensure:

* High performance
* Scalability
* Fault tolerance
* Reliability

Built to handle real-world high traffic and concurrent users 

Objectives

* Design a scalable tourism platform using MERN stack
* Implement microservices architecture
* Enable asynchronous communication using message queues
* Ensure data consistency with concurrency control
* Optimize performance using caching
* Improve stability with rate limiting and clustering 

---

System Architecture

High-Level Design

* Client → API Gateway → Microservices → Database
* Event-driven communication via message broker

the system consists of:

* React frontend
* Node.js API Gateway
* Multiple microservices
* Redis + RabbitMQ + MongoDB integration 

Architecture Components

Frontend

* React.js
* Dynamic UI for user interaction

Backend (API Gateway)

* Node.js + Express
* Handles:

  * Routing
  * Authentication
  * Rate limiting
  * Middleware

Database

* MongoDB (NoSQL)
* Stores:

  * Users
  * Bookings
  * Packages
  * URL mappings

Microservices Design

The system is split into independent services:

Authentication Service

* User registration & login
* Token-based authentication
* Password encryption
* Redis-based locking

Package Service

* Fetch & manage travel packages
* Admin CRUD operations
* Redis caching for fast retrieval

Booking Service

* Booking creation & storage
* Booking history
* Handles concurrent requests

URL Shortening Service

* Generates shareable links
* Maps short URLs to original packages

API Gateway

* Central entry point
* Routes requests
* Applies authentication & rate limiting

Supporting Services

* Redis → caching + concurrency
* RabbitMQ → async communication 

System Workflow

1. Client sends request → API Gateway
2. Gateway applies authentication & rate limiting
3. Data fetched from:

   * Redis (cache)
   * MongoDB (database)
4. Events sent to RabbitMQ
5. Microservices process tasks asynchronously

This reduces blocking and improves performance 

Inter-Service Communication

Synchronous (REST APIs)

* Used for:

  * Login
  * Package fetch
  * Booking creation

Asynchronous (RabbitMQ)

  * Event-driven architecture
  * Services communicate via queues

Example:

* Booking → event → queue → processed later

Improves scalability & fault tolerance 

Concurrency Control

Problem

Multiple users → same operation → race conditions

Solution (Redis Distributed Locking)

* Ensures:

  * No duplicate registrations
  * Safe concurrent processing

Additional Techniques

* Database constraints
* Node.js clustering
* Rate limiting

Ensures data consistency in distributed systems 

Caching Strategy

Redis Caching

Workflow:

1. Check cache
2. Cache hit → return data
3. Cache miss → fetch from DB → store in cache

Used For:

* Package listings
* URL mappings

TTL-based Expiry

* Prevents stale data

Cache Invalidation

* Triggered on updates/deletes

Improves response time & reduces DB load 

Scalability & Performance

* Node.js Clustering → multi-core processing
* Microservices → independent scaling
* Redis → fast data access
* RabbitMQ → async load handling

Designed for **high traffic systems** (page 8 screenshot shows clustering logs) 

Security Features

* Token-based authentication
* Rate limiting
* Input validation
* Secure password handling

Functional Features

User Features

* Register & login
* Browse packages
* Book travel
* View history
* Share packages

Admin Features

* Manage packages
* Monitor system


Project Structure

tourism-management-system/
│
├── client/              # React frontend
├── api-gateway/        # Node.js gateway
├── services/
│   ├── auth-service/
│   ├── booking-service/
│   ├── package-service/
│   ├── url-service/
│
├── config/
├── docker/
├── scripts/
├── README.md


## 📈 Key Engineering Highlights

* Microservices Architecture
* Event-Driven Design
* Distributed Locking
* Caching Layer
* API Gateway Pattern
* Rate Limiting
* Horizontal Scalability

Future Enhancements

* Payment gateway integration
* Notification system (Email/SMS)
* Recommendation engine
* Analytics dashboard
* Kubernetes deployment
