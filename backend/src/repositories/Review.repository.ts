import { ReviewModel, IReview } from '../persistent/models/Review.model';
import { CreateReviewDTO } from '../dto/Review.dto';

export class ReviewRepository {
  async create(data: CreateReviewDTO): Promise<IReview> {
    const review = new ReviewModel(data);
    return await review.save();
  }

  async findById(id: string): Promise<IReview | null> {
    return await ReviewModel.findById(id);
  }

  async findApproved(): Promise<IReview[]> {
    return await ReviewModel.find({ approved: true }).sort({ createdAt: -1 });
  }

  async findAll(): Promise<IReview[]> {
    return await ReviewModel.find().sort({ createdAt: -1 });
  }

  async approve(id: string): Promise<IReview | null> {
    return await ReviewModel.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );
  }

  async reject(id: string): Promise<boolean> {
    const result = await ReviewModel.findByIdAndDelete(id);
    return !!result;
  }
}