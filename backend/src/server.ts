import app from './app';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { UserData } from './models/user.model';
import { MessageData } from './models/message.model';

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
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join_chat', (room: string | string[]) => {
    socket.join(room);
    console.log('User Joined Room: ', room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop_typing', (room) => socket.in(room).emit('stop_typing'));

  socket.on('new_message', (newMessageRecieved: MessageData) => {
    const chat = newMessageRecieved.chat;

    console.log('New Message: ', newMessageRecieved);
    if (!chat.users) return console.log('Chat.users not defined');

    chat.users.forEach(user => {
      if (user._id === newMessageRecieved.sender._id) return;

      socket.in(user._id).emit('message_recieved', newMessageRecieved);
    })
  });

  socket.off('setup', (userData: UserData) => {
    console.log('User Disconnected!');
    socket.leave(userData._id);
  })
});