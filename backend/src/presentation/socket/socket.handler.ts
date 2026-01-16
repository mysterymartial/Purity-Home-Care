import { Server, Socket } from 'socket.io';
import { ChatSessionService } from '../../services/ChatSession.service';
import { CreateMessageDTO } from '../../dto/Message.dto';

export const setupSocketIO = (io: Server): void => {
  const chatSessionService = new ChatSessionService();

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    const sessionId = socket.handshake.query.sessionId as string;

    if (sessionId) {
      socket.join(sessionId);
    }

    // Handle new message
    socket.on('message', async (data: { sessionId: string; content: string; sender: 'customer' | 'admin' }) => {
      try {
        const messageData: CreateMessageDTO = {
          content: data.content,
          sender: data.sender,
        };

        const message = await chatSessionService.createMessage(data.sessionId, messageData);

        // Broadcast to all clients in the session room
        io.to(data.sessionId).emit('message', message);
        
        // Email notification is already handled in ChatSessionService.createMessage
        // This ensures emails are sent even when messages come through Socket.IO
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data: { sessionId: string }) => {
      socket.to(data.sessionId).emit('typing');
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};




