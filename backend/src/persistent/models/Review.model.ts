import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  rating: number;
  text?: string;
  approved: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      maxlength: 1000,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ReviewModel = mongoose.model<IReview>('Review', ReviewSchema);




