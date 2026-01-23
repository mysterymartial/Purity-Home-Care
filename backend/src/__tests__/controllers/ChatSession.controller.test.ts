/// <reference types="jest" />
import { Request, Response } from 'express';
import { ChatSessionController } from '../../presentation/controllers/ChatSession.controller';
import { ChatSessionService } from '../../services/ChatSession.service';
import { AuthRequest } from '../../presentation/middleware/auth.middleware';

// Mock service methods
const mockCreateSession = jest.fn();
const mockCreateMessage = jest.fn();
const mockUpdateStatus = jest.fn();
const mockGetSession = jest.fn();
const mockDeleteSession = jest.fn();

jest.mock('../../services/ChatSession.service', () => {
  return {
    ChatSessionService: jest.fn().mockImplementation(() => {
      return {
        createSession: mockCreateSession,
        createMessage: mockCreateMessage,
        updateStatus: mockUpdateStatus,
        getSession: mockGetSession,
        deleteSession: mockDeleteSession,
      };
    }),
  };
});

describe('ChatSessionController', () => {
  let controller: ChatSessionController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ChatSessionController();

    mockRequest = {
      params: {},
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createSession', () => {
    it('should create session successfully', async () => {
      const mockSession = {
        _id: '507f1f77bcf86cd799439011',
        customerId: 'test-uuid',
        status: 'Pending' as const,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      mockCreateSession.mockResolvedValue(mockSession);

      await controller.createSession(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockSession);
    });

    it('should handle service errors', async () => {
      mockCreateSession.mockRejectedValue(new Error('Service error'));

      await controller.createSession(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Service error' });
    });
  });

  describe('createMessage', () => {
    it('should create message with valid content', async () => {
      mockRequest.params = { sessionId: '507f1f77bcf86cd799439011' };
      mockRequest.body = { content: 'Hello' };

      const mockMessage = {
        _id: '507f1f77bcf86cd799439012',
        chatSessionId: '507f1f77bcf86cd799439011',
        sender: 'customer' as const,
        content: 'Hello',
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      mockCreateMessage.mockResolvedValue(mockMessage);

      await controller.createMessage(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockMessage);
    });

    it('should reject empty content', async () => {
      mockRequest.params = { sessionId: '507f1f77bcf86cd799439011' };
      mockRequest.body = { content: '' };

      await controller.createMessage(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Message content is required' });
    });

    it('should reject missing content', async () => {
      mockRequest.params = { sessionId: '507f1f77bcf86cd799439011' };
      mockRequest.body = {};

      await controller.createMessage(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Message content is required' });
    });

    it('should reject non-string content', async () => {
      mockRequest.params = { sessionId: '507f1f77bcf86cd799439011' };
      mockRequest.body = { content: 123 };

      await controller.createMessage(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Message content is required' });
    });
  });

  describe('updateStatus', () => {
    it('should update status with valid value', async () => {
      mockRequest.params = { sessionId: '507f1f77bcf86cd799439011' };
      mockRequest.body = { status: 'Confirmed' };

      const mockSession = {
        _id: '507f1f77bcf86cd799439011',
        customerId: 'test-uuid',
        status: 'Confirmed' as const,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      mockUpdateStatus.mockResolvedValue(mockSession);

      await controller.updateStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(mockSession);
    });

    it('should reject invalid status', async () => {
      mockRequest.params = { sessionId: '507f1f77bcf86cd799439011' };
      mockRequest.body = { status: 'InvalidStatus' };

      await controller.updateStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid status' });
    });

    it('should handle missing status', async () => {
      mockRequest.params = { sessionId: '507f1f77bcf86cd799439011' };
      mockRequest.body = {};

      await controller.updateStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid status' });
    });

    it('should return 404 when session not found', async () => {
      mockRequest.params = { sessionId: 'invalid-id' };
      mockRequest.body = { status: 'Confirmed' };

      mockUpdateStatus.mockResolvedValue(null);

      await controller.updateStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Chat session not found' });
    });
  });

  describe('deleteSession', () => {
    let mockAuthRequest: Partial<AuthRequest>;

    beforeEach(() => {
      mockAuthRequest = {
        params: {},
        user: {
          email: 'admin@example.com',
          uid: 'test-uid',
        } as any,
      };
    });

    it('should delete session successfully', async () => {
      const sessionId = '507f1f77bcf86cd799439011';
      mockAuthRequest.params = { sessionId };

      const mockSession = {
        _id: sessionId,
        customerId: 'test-uuid',
        status: 'Pending' as const,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      mockGetSession.mockResolvedValue(mockSession);
      mockDeleteSession.mockResolvedValue(true);

      await controller.deleteSession(
        mockAuthRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockGetSession).toHaveBeenCalledWith(sessionId);
      expect(mockDeleteSession).toHaveBeenCalledWith(sessionId, 'admin@example.com');
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Chat session deleted successfully',
      });
    });

    it('should return 404 when session not found', async () => {
      const sessionId = 'invalid-id';
      mockAuthRequest.params = { sessionId };

      mockGetSession.mockResolvedValue(null);
      mockDeleteSession.mockResolvedValue(false);

      await controller.deleteSession(
        mockAuthRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Chat session not found',
      });
    });

    it('should handle deletion errors gracefully', async () => {
      const sessionId = '507f1f77bcf86cd799439011';
      mockAuthRequest.params = { sessionId };

      const error = new Error('Database error');
      mockGetSession.mockRejectedValue(error);

      await controller.deleteSession(
        mockAuthRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

    it('should use unknown email when user email is missing', async () => {
      const sessionId = '507f1f77bcf86cd799439011';
      mockAuthRequest.params = { sessionId };
      mockAuthRequest.user = {} as any;

      const mockSession = {
        _id: sessionId,
        customerId: 'test-uuid',
        status: 'Pending' as const,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      mockGetSession.mockResolvedValue(mockSession);
      mockDeleteSession.mockResolvedValue(true);

      await controller.deleteSession(
        mockAuthRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockDeleteSession).toHaveBeenCalledWith(sessionId, 'unknown');
    });
  });
});



