import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database';
import { initializeFirebase } from './config/firebase';
import chatRoutes from './presentation/routes/chat.routes';
import reviewRoutes from './presentation/routes/review.routes';
import adminRoutes from './presentation/routes/admin.routes';
import { setupSocketIO } from './presentation/socket/socket.handler';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Firebase Admin
console.log('🔄 Initializing Firebase Admin...');
initializeFirebase();

// Connect to MongoDB
console.log('🔄 Connecting to MongoDB Atlas...');
connectDatabase()
  .then(() => {
    console.log('✅ MongoDB connection established');
    
    // Setup Socket.IO
    setupSocketIO(io);

    // Routes
    app.use('/api/chat', chatRoutes);
    app.use('/api/reviews', reviewRoutes);
    app.use('/api/admin', adminRoutes);

    // Health check
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        firebase: 'initialized'
      });
    });

    // Start server
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Socket.IO server ready`);
      console.log(`✅ All services initialized successfully`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });

export { io };



