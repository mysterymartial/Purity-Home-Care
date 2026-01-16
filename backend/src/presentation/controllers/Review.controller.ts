import { Request, Response } from 'express';
import { ReviewService } from '../../services/Review.service';
import { CreateReviewDTO } from '../../dto/Review.dto';

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  createReview = async (req: Request, res: Response): Promise<void> => {
    try {
      const { rating, text }: CreateReviewDTO = req.body;

      if (!rating || rating < 1 || rating > 5) {
        res.status(400).json({ error: 'Rating must be between 1 and 5' });
        return;
      }

      const review = await this.reviewService.createReview({ rating, text });
      res.status(201).json(review);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getApprovedReviews = async (req: Request, res: Response): Promise<void> => {
    try {
      const reviews = await this.reviewService.getApprovedReviews();
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAllReviews = async (req: Request, res: Response): Promise<void> => {
    try {
      const reviews = await this.reviewService.getAllReviews();
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  approveReview = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reviewId } = req.params;
      const review = await this.reviewService.approveReview(reviewId);

      if (!review) {
        res.status(404).json({ error: 'Review not found' });
        return;
      }

      res.json(review);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  rejectReview = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reviewId } = req.params;
      const success = await this.reviewService.rejectReview(reviewId);

      if (!success) {
        res.status(404).json({ error: 'Review not found' });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
