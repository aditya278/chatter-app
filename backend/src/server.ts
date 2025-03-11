import app from './app';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { UserData } from './db/schema/user.schema';

// Define a simplified message type for socket communication
interface SocketMessage {
  id: number;
  content: string;
  sender: {
    id: number;
    name: string;
    email: string;
    picture: string;
  };
  chat: {
    id: number;
    chatName: string;
    isGroupChat: boolean;
    users: Array<{
      id: number;
      name: string;
      email: string;
      picture: string;
    }>;
  };
}

dotenv.config();

const PORT: Number = +(process.env.PORT || 5050);

const server = app.listen(PORT, () => console.log(`⚡️[server]: Server is running at port ${PORT}`));

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('Connected to socket.io');

  socket.on('setup', (userData: UserData) => {
    socket.join(userData.id.toString());
    socket.emit('connected');
  });

  socket.on('join_chat', (room: string | string[]) => {
    socket.join(room);
    console.log('User Joined Room: ', room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop_typing', (room) => socket.in(room).emit('stop_typing'));

  socket.on('new_message', (newMessageReceived: SocketMessage) => {
    const chat = newMessageReceived.chat;

    console.log('New Message: ', newMessageReceived);
    if (!chat.users) return console.log('Chat.users not defined');

    chat.users.forEach(user => {
      if (user.id === newMessageReceived.sender.id) return;

      socket.in(user.id.toString()).emit('message_recieved', newMessageReceived);
    });
  });

  socket.off('setup', (userData: UserData) => {
    console.log('User Disconnected!');
    socket.leave(userData.id.toString());
  });
});