import { Request, Response, NextFunction } from 'express';
import { authenticateAdmin } from '../../presentation/middleware/auth.middleware';
import admin from 'firebase-admin';

jest.mock('firebase-admin');

describe('authenticateAdmin Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

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

    (admin.auth().verifyIdToken as jest.Mock) = jest.fn().mockResolvedValue(mockDecodedToken);

    await authenticateAdmin(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.user).toEqual(mockDecodedToken);
  });

  it('should reject request without token', async () => {
    mockRequest.headers = {};

    await authenticateAdmin(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized: No token provided' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject request with invalid token format', async () => {
    mockRequest.headers = {
      authorization: 'InvalidFormat token',
    };

    await authenticateAdmin(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized: No token provided' });
  });

  it('should reject invalid token', async () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    };

    (admin.auth().verifyIdToken as jest.Mock) = jest.fn().mockRejectedValue(new Error('Invalid token'));

    await authenticateAdmin(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized: Invalid token' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle empty Bearer token', async () => {
    mockRequest.headers = {
      authorization: 'Bearer ',
    };

    await authenticateAdmin(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
  });
});

