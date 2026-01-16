import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { ChatSessionController } from '../controllers/ChatSession.controller';

const router: ExpressRouter = Router();
const chatSessionController = new ChatSessionController();

// Create a new chat session
router.post('/sessions', chatSessionController.createSession);

// Get a specific chat session
router.get('/sessions/:sessionId', chatSessionController.getSession);

// Get all messages for a session
router.get('/sessions/:sessionId/messages', chatSessionController.getMessages);

// Create a new message in a session
router.post('/sessions/:sessionId/messages', chatSessionController.createMessage);

export default router;



