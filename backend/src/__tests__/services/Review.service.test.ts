/// <reference types="jest" />
import { ReviewService } from '../../services/Review.service';
import { ReviewRepository } from '../../repositories/Review.repository';

// Mock repository methods
const mockCreate = jest.fn();
const mockFindApproved = jest.fn();
const mockFindAll = jest.fn();
const mockApprove = jest.fn();
const mockReject = jest.fn();

jest.mock('../../repositories/Review.repository', () => {
  return {
    ReviewRepository: jest.fn().mockImplementation(() => {
      return {
        create: mockCreate,
        findApproved: mockFindApproved,
        findAll: mockFindAll,
        approve: mockApprove,
        reject: mockReject,
      };
    }),
  };
});

describe('ReviewService', () => {
  let reviewService: ReviewService;

  beforeEach(() => {
    jest.clearAllMocks();
    reviewService = new ReviewService();
  });

  describe('createReview', () => {
    it('should create review with valid rating (1-5)', async () => {
      const mockReview = {
        _id: '507f1f77bcf86cd799439011',
        rating: 5,
        text: 'Great service!',
        approved: false,
        createdAt: new Date(),
      };

      mockCreate.mockResolvedValue(mockReview);

      const result = await reviewService.createReview({ rating: 5, text: 'Great service!' });

      expect(result.rating).toBe(5);
      expect(result.text).toBe('Great service!');
    });

    it('should reject rating below 1', async () => {
      await expect(reviewService.createReview({ rating: 0 })).rejects.toThrow(
        'Rating must be between 1 and 5'
      );
    });

    it('should reject rating above 5', async () => {
      await expect(reviewService.createReview({ rating: 6 })).rejects.toThrow(
        'Rating must be between 1 and 5'
      );
    });

    it('should accept minimum rating (1)', async () => {
      const mockReview = {
        _id: '507f1f77bcf86cd799439011',
        rating: 1,
        approved: false,
        createdAt: new Date(),
      };

      mockCreate.mockResolvedValue(mockReview);

      const result = await reviewService.createReview({ rating: 1 });

      expect(result.rating).toBe(1);
    });

    it('should accept maximum rating (5)', async () => {
      const mockReview = {
        _id: '507f1f77bcf86cd799439011',
        rating: 5,
        approved: false,
        createdAt: new Date(),
      };

      mockCreate.mockResolvedValue(mockReview);

      const result = await reviewService.createReview({ rating: 5 });

      expect(result.rating).toBe(5);
    });

    it('should handle review without text', async () => {
      const mockReview = {
        _id: '507f1f77bcf86cd799439011',
        rating: 4,
        approved: false,
        createdAt: new Date(),
      };

      mockCreate.mockResolvedValue(mockReview);

      const result = await reviewService.createReview({ rating: 4 });

      expect(result.text).toBeUndefined();
    });

    it('should handle very long review text', async () => {
      const longText = 'a'.repeat(1000);
      const mockReview = {
        _id: '507f1f77bcf86cd799439011',
        rating: 5,
        text: longText,
        approved: false,
        createdAt: new Date(),
      };

      mockCreate.mockResolvedValue(mockReview);

      const result = await reviewService.createReview({ rating: 5, text: longText });

      expect(result.text?.length).toBe(1000);
    });

    it('should handle empty text string', async () => {
      const mockReview = {
        _id: '507f1f77bcf86cd799439011',
        rating: 3,
        text: '',
        approved: false,
        createdAt: new Date(),
      };

      mockCreate.mockResolvedValue(mockReview);

      const result = await reviewService.createReview({ rating: 3, text: '' });

      expect(result.text).toBe('');
    });
  });

  describe('getApprovedReviews', () => {
    it('should return only approved reviews', async () => {
      const mockReviews = [
        {
          _id: '1',
          rating: 5,
          text: 'Great!',
          approved: true,
          createdAt: new Date(),
        },
        {
          _id: '2',
          rating: 4,
          text: 'Good',
          approved: true,
          createdAt: new Date(),
        },
      ];

      mockFindApproved.mockResolvedValue(mockReviews);

      const result = await reviewService.getApprovedReviews();

      expect(result.length).toBe(2);
      expect(result.every((r: { approved: boolean }) => r.approved)).toBe(true);
    });

    it('should return empty array when no approved reviews', async () => {
      mockFindApproved.mockResolvedValue([]);

      const result = await reviewService.getApprovedReviews();

      expect(result).toEqual([]);
    });
  });

  describe('getAllReviews', () => {
    it('should return all reviews including unapproved', async () => {
      const mockReviews = [
        {
          _id: '1',
          rating: 5,
          text: 'Great!',
          approved: true,
          createdAt: new Date(),
        },
        {
          _id: '2',
          rating: 4,
          text: 'Good',
          approved: false,
          createdAt: new Date(),
        },
        {
          _id: '3',
          rating: 3,
          text: 'Average',
          approved: true,
          createdAt: new Date(),
        },
      ];

      mockFindAll.mockResolvedValue(mockReviews);

      const result = await reviewService.getAllReviews();

      expect(result.length).toBe(3);
      expect(result.some((r: { approved: boolean }) => r.approved)).toBe(true);
      expect(result.some((r: { approved: boolean }) => !r.approved)).toBe(true);
    });

    it('should return empty array when no reviews exist', async () => {
      mockFindAll.mockResolvedValue([]);

      const result = await reviewService.getAllReviews();

      expect(result).toEqual([]);
    });
  });

  describe('approveReview', () => {
    it('should approve review successfully', async () => {
      const reviewId = '507f1f77bcf86cd799439011';
      const mockReview = {
        _id: reviewId,
        rating: 5,
        text: 'Great!',
        approved: true,
        createdAt: new Date(),
      };

      mockApprove.mockResolvedValue(mockReview);

      const result = await reviewService.approveReview(reviewId);

      expect(result?.approved).toBe(true);
    });

    it('should return null when review not found', async () => {
      mockApprove.mockResolvedValue(null);

      const result = await reviewService.approveReview('invalid-id');

      expect(result).toBeNull();
    });
  });

  describe('rejectReview', () => {
    it('should reject review successfully', async () => {
      mockReject.mockResolvedValue(true);

      const result = await reviewService.rejectReview('507f1f77bcf86cd799439011');

      expect(result).toBe(true);
    });

    it('should return false when review not found', async () => {
      mockReject.mockResolvedValue(false);

      const result = await reviewService.rejectReview('invalid-id');

      expect(result).toBe(false);
    });
  });
});
