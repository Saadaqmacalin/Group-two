# E-commerce Backend API

A robust Node.js/Express backend for an e-commerce platform, featuring user authentication, product management, order processing, and more.

## Features

- **User Authentication**: Register, login, and profile management with JWT and bcrypt.
- **Admin Management**: Dedicated endpoints for user management and system audits.
- **Category Management**: Full CRUD for organizing products.
- **Product Management**: CRUD operations with keyword search and category filtering.
- **Customer Management**: Detailed records for customer interactions.
- **Order Processing**: Item tracking, shipping details, and order status management.
- **Payment Integration**: Recording transactions and automatically updating order statuses.
- **Sales Tracking**: Revenue summaries and inventory auto-reduction.
- **Messaging**: Contact form handling for customer support.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Security**: JWT (JSON Web Tokens), bcryptjs
- **Environment**: dotenv

## Project Structure

```text
backend/
├── controllers/    # Request handlers and business logic
├── db/             # Database connection setup
├── middleware/     # Auth and Admin protection
├── models/         # Mongoose schemas
├── routers/        # API route definitions
└── index.js        # Main entry point
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the `backend` root with:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. **Run the Server**:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Auth & Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get current user profile (Private)
- `PUT /api/users/profile` - Update current user profile (Private)
- `GET /api/users` - Get all users (Private/Admin)
- `DELETE /api/users/:id` - Delete a user (Private/Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a category (Private/Admin)
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update a category (Private/Admin)
- `DELETE /api/categories/:id` - Delete a category (Private/Admin)

### Products
- `GET /api/products` - Get all products (supports `?category` and `?keyword` filters)
- `POST /api/products` - Create a product (Private/Admin)
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update a product (Private/Admin)
- `DELETE /api/products/:id` - Delete a product (Private/Admin)

### Customers
- `GET /api/customers` - Get all customers (Private/Admin)
- `POST /api/customers` - Create a customer (Private/Admin)
- `GET /api/customers/:id` - Get customer by ID (Private/Admin)
- `PUT /api/customers/:id` - Update a customer (Private/Admin)
- `DELETE /api/customers/:id` - Delete a customer (Private/Admin)

### Orders
- `GET /api/orders` - Get all orders (Private/Admin)
- `POST /api/orders` - Create a new order (Private/Admin)
- `GET /api/orders/:id` - Get order by ID (Private/Admin)
- `DELETE /api/orders/:id` - Delete an order (Private/Admin)
- `PUT /api/orders/:id/status` - Update order status (Private/Admin)

### Payments
- `GET /api/payments` - Get all payment records (Private/Admin)
- `POST /api/payments` - Record a new payment (Private/Admin)
- `GET /api/payments/:id` - Get payment details by ID (Private/Admin)

### Messages
- `POST /api/messages` - Send a contact message (Public)
- `GET /api/messages` - Get all messages (Private/Admin)
- `GET /api/messages/:id` - Get message by ID (Private/Admin)
- `DELETE /api/messages/:id` - Delete a message (Private/Admin)

### Sales
- `GET /api/sales` - Get all sales records (Private/Admin)
- `POST /api/sales` - Record a new sale (Private/Admin)
- `GET /api/sales/summary` - Get sales revenue summary (Private/Admin)

---
Developed with ❤️ by the E-commerce Team.
