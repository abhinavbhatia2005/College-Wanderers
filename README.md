# College Explorer - College Trip Management

A MERN stack application for managing college trips to destinations all accross the world. This application allows college students to explore and book trips to various locations.

## Features

- User authentication (signup, login, logout)
- Browse available college trips
- Search and filter trips by destination, date, etc.
- Trip details with information about destinations
- Booking system for trips
- User profile management
- Create and manage trips (for admin users)

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Installation and Setup

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/college-explorer
   JWT_SECRET=your_jwt_secret
   ```

4. Seed the database with sample trips:
   ```
   npm run seed
   ```

5. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. Access the application at `http://localhost:5173` (or the port shown in your terminal)

## Admin Access

After seeding the database, you can use the following admin credentials:

- Email: admin@college.edu
- Password: admin123

## Learning Resources for College Students

This project can be used by college students to learn:

1. Full-stack web development with MERN
2. Authentication and authorization
3. State management in React
4. Responsive UI design with Tailwind CSS
5. API development with Express
6. Database operations with MongoDB 
