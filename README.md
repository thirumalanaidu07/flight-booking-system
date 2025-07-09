# Flight Booking App

A full-stack web application for booking flights, managing bookings, and administering users and flights. Built with React (frontend) and Node.js/Express/MongoDB (backend).

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)
- [License](#license)

---

## Features

- User registration and login (customer, admin, flight-operator roles)
- Flight search and booking
- View and manage bookings
- Admin dashboard for managing users, flights, and bookings
- Flight operator dashboard for managing flights
- Responsive UI with modern design
- Protected routes for authenticated users and roles

---

## Project Structure

```
flight-booking-app/
│
├── client/                # React frontend
│   ├── public/            # Static assets and HTML
│   ├── src/
│   │   ├── assets/        # Images and icons
│   │   ├── components/    # Reusable components (Login, Register, Navbar)
│   │   ├── context/       # React Context for global state
│   │   ├── pages/         # Main pages (LandingPage, Bookings, Admin, etc.)
│   │   ├── RouteProtectors/ # Route protection components
│   │   ├── styles/        # CSS files
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── .gitignore
│
├── server/                # Node.js/Express backend
│   ├── index.js           # Main server file
│   ├── schemas.js         # Mongoose schemas
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

---

## Tech Stack

- **Frontend:** React, React Router, Axios, Bootstrap
- **Backend:** Node.js, Express, MongoDB, Mongoose, bcrypt, CORS, body-parser
- **Other:** Context API for state management, CSS modules

---

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- MongoDB running locally (default port 27017)

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/flight-booking-app.git
cd flight-booking-app
```

### 2. Install dependencies

#### Client

```sh
cd client
npm install
```

#### Server

```sh
cd ../server
npm install
```

### 3. Start the development servers

#### Start MongoDB

Make sure MongoDB is running locally.

#### Start Backend

```sh
cd server
npm start
```

#### Start Frontend

```sh
cd ../client
npm start
```

- Client runs on [http://localhost:3000](http://localhost:3000)
- Server runs on [http://localhost:6001](http://localhost:6001)

---

## Available Scripts

### Client

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Runs tests

### Server

- `npm start` - Starts the Express server

---

## API Endpoints

### Auth & User

- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /fetch-user/:id` - Get user details
- `GET /fetch-users` - Get all users
- `POST /approve-operator` - Approve flight operator
- `POST /reject-operator` - Reject flight operator

### Flights

- `GET /fetch-flights` - Get all flights
- `POST /add-flight` - Add new flight
- `PUT /update-flight` - Update flight

### Bookings

- `GET /fetch-bookings` - Get all bookings
- `POST /book-ticket` - Book a flight
- `PUT /cancel-ticket/:id` - Cancel a booking

---

## Environment Variables

- The backend connects to MongoDB at `mongodb://localhost:27017/flight-booking` by default.
- For production, update the connection string in [`server/index.js`](server/index.js).

---

## Screenshots

> Add screenshots of the landing page, booking flow, admin dashboard, etc.

---

## License

This project is licensed under the MIT License.

---

## Authors

- [Your Name](https://github.com/yourusername)

---

## Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Bootstrap](https://getbootstrap.com/)
