/// <reference types="jest" />
import { Response, NextFunction } from 'express';
import { authenticateAdmin, AuthRequest } from '../../presentation/middleware/auth.middleware';

// Create mock function at module level - this will be hoisted
const mockVerifyIdToken = jest.fn();

jest.mock('firebase-admin', () => {
  // Use the mock function from outer scope
  return {
    __esModule: true,
    default: {
      auth: jest.fn(() => ({
        verifyIdToken: mockVerifyIdToken,
      })),
    },
  };
});

describe('authenticateAdmin Middleware', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockVerifyIdToken.mockClear();

    mockRequest = {
      headers: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  it('should authenticate valid token', async () => {
    const mockDecodedToken = {
      uid: 'FjR4gwNEUnb1A7VGzLqdpMwNNbP2',
      email: 'purityfamilyservicextonpa@yahoo.com',
    };

    mockRequest.headers = {
      authorization: 'Bearer valid-token',
    };

    mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

    await authenticateAdmin(mockRequest as AuthRequest, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.user).toEqual(mockDecodedToken);
  });

  it('should reject request without token', async () => {
    mockRequest.headers = {};

    await authenticateAdmin(mockRequest as AuthRequest, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized: No token provided' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject request with invalid token format', async () => {
    mockRequest.headers = {
      authorization: 'InvalidFormat token',
    };

    await authenticateAdmin(mockRequest as AuthRequest, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized: No token provided' });
  });

  it('should reject invalid token', async () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    };

    mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));

    await authenticateAdmin(mockRequest as AuthRequest, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized: Invalid token' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle empty Bearer token', async () => {
    mockRequest.headers = {
      authorization: 'Bearer ',
    };

    await authenticateAdmin(mockRequest as AuthRequest, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
  });
});
