import { Router } from 'express';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { ChatSessionController } from '../controllers/ChatSession.controller';
import { ReviewController } from '../controllers/Review.controller';

const router = Router();
const chatSessionController = new ChatSessionController();
const reviewController = new ReviewController();

// All admin routes require authentication
router.use(authenticateAdmin);

// Chat session management
router.get('/chat/sessions', chatSessionController.getAllSessions);
router.get('/chat/sessions/:sessionId/messages', chatSessionController.getMessages);
router.post('/chat/sessions/:sessionId/messages', chatSessionController.createAdminMessage);
router.patch('/chat/sessions/:sessionId/status', chatSessionController.updateStatus);

// Review management
router.get('/reviews', reviewController.getAllReviews);
router.patch('/reviews/:reviewId/approve', reviewController.approveReview);
router.delete('/reviews/:reviewId/reject', reviewController.rejectReview);

export default router;

