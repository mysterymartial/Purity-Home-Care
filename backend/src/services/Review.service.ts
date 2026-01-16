import { ReviewRepository } from '../repositories/Review.repository';
import { CreateReviewDTO, ReviewResponseDTO } from '../dto/Review.dto';
import { IReview } from '../persistent/models/Review.model';

export class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  async createReview(data: CreateReviewDTO): Promise<ReviewResponseDTO> {
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const review = await this.reviewRepository.create(data);
    return this.toResponseDTO(review);
  }

  async getApprovedReviews(): Promise<ReviewResponseDTO[]> {
    const reviews = await this.reviewRepository.findApproved();
    return reviews.map((r: IReview) => this.toResponseDTO(r));
  }

  async getAllReviews(): Promise<ReviewResponseDTO[]> {
    const reviews = await this.reviewRepository.findAll();
    return reviews.map((r: IReview) => this.toResponseDTO(r));
  }

  async approveReview(reviewId: string): Promise<ReviewResponseDTO | null> {
    const review = await this.reviewRepository.approve(reviewId);
    return review ? this.toResponseDTO(review) : null;
  }

  async rejectReview(reviewId: string): Promise<boolean> {
    return await this.reviewRepository.reject(reviewId);
  }

  private toResponseDTO(review: any): ReviewResponseDTO {
    return {
      _id: review._id.toString(),
      rating: review.rating,
      text: review.text,
      approved: review.approved,
      createdAt: review.createdAt.toISOString(),
    };
  }
}