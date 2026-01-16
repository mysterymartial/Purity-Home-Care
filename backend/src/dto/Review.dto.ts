export interface CreateReviewDTO {
  rating: number;
  text?: string;
}

export interface ReviewResponseDTO {
  _id: string;
  rating: number;
  text?: string;
  approved: boolean;
  createdAt: string;
}

