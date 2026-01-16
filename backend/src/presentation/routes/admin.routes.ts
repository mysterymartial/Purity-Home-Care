import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { ChatSessionController } from '../controllers/ChatSession.controller';
import { ReviewController } from '../controllers/Review.controller';
import { SettingsController } from '../controllers/Settings.controller';

const router: ExpressRouter = Router();
const chatSessionController = new ChatSessionController();
const reviewController = new ReviewController();
const settingsController = new SettingsController();

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

// Settings management
router.get('/settings/notifications', settingsController.getNotificationPreferences);
router.patch('/settings/notifications', settingsController.updateNotificationPreferences);

export default router;

