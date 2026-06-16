# StockPilot AI - Backend

StockPilot AI Backend is a Node.js and Express.js REST API that powers the StockPilot inventory management platform.

## Features

* JWT Authentication
* User Registration & Login
* Product Management
* Inventory Tracking
* Low Stock Alerts
* PostgreSQL Database Integration
* Secure API Endpoints

## Tech Stack

* Node.js
* Express.js
* PostgreSQL (Neon)
* JWT Authentication
* bcrypt
* CORS

## Environment Variables

Create a `.env` file:

PORT=5000

DATABASE_URL=your_neon_database_url

JWT_SECRET=your_secret_key

## Installation

npm install

npm run dev

## API Endpoints

### Authentication

POST /api/auth/register

POST /api/auth/login

### Products

GET /api/products

POST /api/products

PUT /api/products/:id

DELETE /api/products/:id

## Author

Deepan Palani
