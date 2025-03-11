# Chatter App

A real-time chat application built with modern web technologies. This application allows users to chat in real-time, create group chats, and search for users.

## Features

- **User Authentication**: Secure login and registration system
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **One-on-One Chat**: Private conversations between users
- **Group Chat**: Create and manage group conversations
- **User Search**: Find other users to chat with
- **Typing Indicators**: See when someone is typing a message
- **Message History**: View past conversations
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript
- **Chakra UI**: Component library for styling
- **Socket.IO Client**: Real-time communication
- **Axios**: HTTP client for API requests
- **React Router**: Navigation and routing

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **TypeScript**: Type-safe JavaScript
- **PostgreSQL**: Relational database (migrated from MongoDB)
- **Drizzle ORM**: Database ORM for PostgreSQL
- **Socket.IO**: Real-time communication
- **JWT**: Authentication
- **Zod**: Schema validation
- **Swagger**: API documentation

## Project Structure

```
chatter-app/
├── frontend/             # React frontend application
│   ├── src/
│   │   ├── Api/          # API models and interfaces
│   │   ├── components/   # React components
│   │   ├── context/      # React context providers
│   │   ├── config/       # Configuration utilities
│   │   └── animations/   # Animation assets
│   └── ...
├── backend/              # Node.js backend application
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── db/           # Database configuration and schemas
│   │   ├── utils/        # Utility functions
│   │   └── models/       # Data models
│   └── ...
└── ...
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/chatter-app.git
   cd chatter-app
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5050
   JWT_SECRET=your_jwt_secret
   DATABASE_URL=your_postgresql_connection_string
   ```

4. Run database migrations
   ```bash
   npm run migrate
   ```

5. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

6. Create a `.env` file in the frontend directory with the following variables:
   ```
   VITE_BACKEND_URI=http://localhost:5050
   ```

### Running the Application

1. Start the backend server
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Recent Updates

- Migrated from MongoDB to PostgreSQL using Drizzle ORM
- Added real-time typing indicators with improved debounce
- Enhanced message ordering and display
- Improved real-time communication with Socket.IO
- Added Swagger documentation for API endpoints

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Chakra UI](https://chakra-ui.com/) for the component library
- [Socket.IO](https://socket.io/) for real-time communication
- [Drizzle ORM](https://orm.drizzle.team/) for database operations