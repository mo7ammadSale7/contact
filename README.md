# Contact Management System

A real-time contact management application built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) featuring real-time updates using WebSocket connections.

## Features

- 👤 User Authentication (Hardcoded users)
- 📱 Contact Management (CRUD operations)
- 🔄 Real-time Contact Locking System
- 📊 Server-side Pagination
- 🔍 Column Filtering
- ⚡ Real-time Updates using WebSocket

## Tech Stack

- Frontend: Angular 18
- Backend: NestJS (Node.js 20)
- Database: MongoDB
- Real-time Communication: WebSocket
- Containerization: Docker

## Prerequisites

- Docker and Docker Compose (for Docker-based setup)

OR

- Node.js 20.x
- MongoDB

## Installation & Running the Application

### Using Docker (Recommended)

1. Clone the repository:

```bash
git clone https://github.com/mo7ammadSale7/contact
cd contact
```

2. Start the application using Docker Compose:

```bash
docker-compose up --build
```

3. Access the application:

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

### Manual Setup

If you prefer not to use Docker, you can run each component separately:

#### Database Setup

1. Install and start MongoDB locally
2. Make sure MongoDB is running on port 27017

#### Backend Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm run start:dev
```

The server will start on http://localhost:3000

#### Frontend Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Update the API URL in the environment files to point to your local server

4. Start the Angular application:

```bash
ng serve
```

The application will be available at http://localhost:4200

## Authentication

The application supports two hardcoded users:

1. Username: `user1`, Password: `user1`
2. Username: `user2`, Password: `user2`

## Features Description

### Contact Management

- Add new contacts with the following details:
  - Name
  - Phone
  - Address
  - Notes
- View contacts in a paginated grid (5 contacts per page)
- Edit existing contacts directly in the grid
- Delete contacts with confirmation dialog
- Real-time contact locking system when being edited by another user

### Grid Features

- Server-side pagination (5 items per page)
- Column filtering for better data organization
- Real-time updates using WebSocket connection

## Project Structure

```
├── client/                 # Angular frontend application
├── server/                 # NestJS backend application
├── docker-compose.yaml     # Docker composition file
└── README.md              # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Notes

- The application uses WebSocket for real-time updates
- Contact locking is implemented to prevent concurrent edits
- All data is persisted in MongoDB
- The server is configured to handle CORS and WebSocket connections
- The frontend is built with Angular Material for consistent UI/UX

## Troubleshooting

1. If you encounter CORS issues in development:

   - Ensure the API_URL in the frontend environment matches the backend URL
   - Check if the backend CORS configuration includes your frontend origin

2. If real-time updates aren't working:

   - Verify that WebSocket connection is not blocked by any firewall
   - Check browser console for connection errors

3. For MongoDB connection issues:
   - Ensure MongoDB is running and accessible
   - Verify the connection string in the server's environment variables
