# Chatter Backend

The backend server for the Chatter web application.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- PostgreSQL with Neon
- Drizzle ORM
- Socket.io for real-time communication

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database (or Neon account)

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file based on `.env.example` and fill in your database credentials:

```
# Database
NEON_CONNECTION_STRING=postgresql://username:password@hostname/database

# JWT
JWT_SECRET=your_jwt_secret

# Server
PORT=5000
```

5. Generate database migrations:

```bash
npm run db:generate
```

6. Apply migrations to your database:

```bash
npm run db:migrate
```

7. Start the development server:

```bash
npm run dev
```

## Database Schema

The application uses PostgreSQL with Drizzle ORM. The schema includes:

- Users: User accounts with authentication
- Chats: Chat rooms (group or direct)
- Messages: Messages within chats

## API Endpoints

### User Routes

- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Authenticate a user
- `GET /api/user?search=query` - Search for users

### Chat Routes

- `POST /api/chat` - Create a new chat
- `GET /api/chat` - Get all chats for a user
- `POST /api/chat/group` - Create a group chat
- `PUT /api/chat/group/rename` - Rename a group chat
- `PUT /api/chat/group/add` - Add a user to a group chat
- `PUT /api/chat/group/remove` - Remove a user from a group chat

### Message Routes

- `POST /api/message` - Send a message
- `GET /api/message/:chatId` - Get all messages for a chat

## Development

### Database Management

- Generate migrations: `npm run db:generate`
- Apply migrations: `npm run db:migrate`
- View database with Drizzle Studio: `npm run db:studio` 