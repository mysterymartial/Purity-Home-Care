import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { ReviewController } from '../controllers/Review.controller';

const router: ExpressRouter = Router();
const reviewController = new ReviewController();

// Create a new review (public)
router.post('/', reviewController.createReview);

// Get approved reviews (public)
router.get('/approved', reviewController.getApprovedReviews);

export default router;
