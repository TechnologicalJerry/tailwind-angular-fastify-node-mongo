# 🚀 API Endpoints Documentation

## Server Information
- **Base URL**: `http://localhost:3000`
- **Documentation**: `http://localhost:3000/docs`

---

## 🏠 General Endpoints

### Health Check
- **GET** `/health`
- **Description**: Check server health status
- **Response**: Server health, timestamp, uptime

### API Info
- **GET** `/api/info`
- **Description**: Get API information and available endpoints
- **Response**: API name, version, endpoints list

### Root
- **GET** `/`
- **Description**: Welcome message
- **Response**: API welcome message with links

---

## 🔐 Authentication Endpoints (`/api/auth`)

### Register
- **POST** `/api/auth/register`
- **Body**: `{ email, password, firstName, lastName }`
- **Description**: Register a new user
- **Response**: User data, access token, refresh token

### Login
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Description**: Login user
- **Response**: User data, access token, refresh token

### Refresh Token
- **POST** `/api/auth/refresh`
- **Body**: `{ refreshToken }`
- **Description**: Refresh access token
- **Response**: New access token, refresh token

### Get Profile
- **GET** `/api/auth/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Description**: Get current user profile
- **Response**: User profile data

### Logout
- **POST** `/api/auth/logout`
- **Headers**: `Authorization: Bearer {token}`
- **Description**: Logout current session
- **Response**: Success message

### Logout All
- **POST** `/api/auth/logout-all`
- **Headers**: `Authorization: Bearer {token}`
- **Description**: Logout from all sessions
- **Response**: Success message with revoked count

### Change Password
- **POST** `/api/auth/change-password`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ currentPassword, newPassword }`
- **Description**: Change user password
- **Response**: Success message

### Forgot Password
- **POST** `/api/auth/forgot-password`
- **Body**: `{ email }`
- **Description**: Request password reset
- **Response**: Success message

### Reset Password
- **POST** `/api/auth/reset-password`
- **Body**: `{ token, newPassword }`
- **Description**: Reset password with token
- **Response**: Success message

---

## 👥 User Endpoints (`/api/users`)

### Get All Users (Admin Only)
- **GET** `/api/users`
- **Headers**: `Authorization: Bearer {token}`
- **Query**: `page, limit, search, role, isActive`
- **Description**: Get list of all users
- **Response**: Users array with pagination

### Get User by ID
- **GET** `/api/users/:id`
- **Headers**: `Authorization: Bearer {token}`
- **Description**: Get user by ID
- **Response**: User data

### Update User
- **PUT** `/api/users/:id`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ email, firstName, lastName, role, isActive, emailVerified }`
- **Description**: Update user information
- **Response**: Success message

### Delete User
- **DELETE** `/api/users/:id`
- **Headers**: `Authorization: Bearer {token}`
- **Description**: Delete user
- **Response**: Success message

### Get My Profile
- **GET** `/api/users/profile/me`
- **Headers**: `Authorization: Bearer {token}`
- **Description**: Get current user profile
- **Response**: User profile data

### Update My Profile
- **PUT** `/api/users/profile/me`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ email, firstName, lastName }`
- **Description**: Update current user profile
- **Response**: Success message

---

## 📦 Product Endpoints (`/api/products`)

### Get All Products (Public)
- **GET** `/api/products`
- **Query**: `page, limit, category, minPrice, maxPrice, inStock, search`
- **Description**: Get list of all products
- **Response**: Products array with pagination

### Get Product by ID (Public)
- **GET** `/api/products/:id`
- **Description**: Get product by ID
- **Response**: Product data

### Create Product (Protected)
- **POST** `/api/products`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ name, description, price, category, stock, images }`
- **Description**: Create new product
- **Response**: Created product data

### Update Product (Protected)
- **PUT** `/api/products/:id`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ name, description, price, category, stock, images, isActive }`
- **Description**: Update product
- **Response**: Success message

### Delete Product (Protected)
- **DELETE** `/api/products/:id`
- **Headers**: `Authorization: Bearer {token}`
- **Description**: Delete product
- **Response**: Success message

### Get Categories
- **GET** `/api/products/categories/list`
- **Description**: Get list of product categories
- **Response**: Array of categories

### Search Products
- **GET** `/api/products/search/:query`
- **Description**: Search products by query
- **Response**: Matching products array

---

## 🔒 Security Features

- ✅ **JWT Authentication**: Access and refresh tokens
- ✅ **Rate Limiting**: 
  - Auth endpoints: 5 requests per 15 minutes
  - General endpoints: 100 requests per 15 minutes
- ✅ **CORS**: Configured for cross-origin requests
- ✅ **Helmet**: Security headers
- ✅ **Password Hashing**: bcrypt with 12 salt rounds
- ✅ **Session Management**: Active session tracking
- ✅ **Input Validation**: JSON schema validation on all endpoints

---

## 🚀 Quick Start

### 1. Start the server:
\`\`\`bash
npm run dev
\`\`\`

### 2. Register a user:
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"Password123","firstName":"John","lastName":"Doe"}'
\`\`\`

### 3. Login:
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"Password123"}'
\`\`\`

### 4. Use the token:
\`\`\`bash
curl -X GET http://localhost:3000/api/auth/profile \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
\`\`\`

---

## 📝 Response Format

All API responses follow this format:

### Success Response:
\`\`\`json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
\`\`\`

### Error Response:
\`\`\`json
{
  "success": false,
  "message": "Error message"
}
\`\`\`

---

## 🛠️ Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run dev:tsx` - Start development server with tsx watch
- `npm run start:dev` - Start server with tsx
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server

---

## ⚙️ Environment Variables

Create a `.env` file with:
\`\`\`env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/tailwind-angular-fastify-node-mongo
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
ENCRYPTION_KEY=your-32-character-encryption-key
\`\`\`

