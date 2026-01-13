import { ChatSessionService } from '../../services/ChatSession.service';
import { ChatSessionRepository } from '../../repositories/ChatSession.repository';
import { MessageRepository } from '../../repositories/Message.repository';

// Mock repositories
jest.mock('../../repositories/ChatSession.repository');
jest.mock('../../repositories/Message.repository');

describe('ChatSessionService', () => {
  let chatSessionService: ChatSessionService;
  let mockChatSessionRepository: jest.Mocked<ChatSessionRepository>;
  let mockMessageRepository: jest.Mocked<MessageRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    chatSessionService = new ChatSessionService();
    mockChatSessionRepository = ChatSessionRepository as jest.MockedClass<typeof ChatSessionRepository>;
    mockMessageRepository = MessageRepository as jest.MockedClass<typeof MessageRepository>;
  });

  describe('createSession', () => {
    it('should create a new chat session with valid UUID', async () => {
      const mockSession = {
        _id: '507f1f77bcf86cd799439011',
        customerId: 'test-uuid-123',
        status: 'Pending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockChatSessionRepository.prototype.create = jest.fn().mockResolvedValue(mockSession);

      const result = await chatSessionService.createSession();

      expect(result).toBeDefined();
      expect(result.customerId).toBeDefined();
      expect(result.status).toBe('Pending');
      expect(mockChatSessionRepository.prototype.create).toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      mockChatSessionRepository.prototype.create = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(chatSessionService.createSession()).rejects.toThrow('Database error');
    });
  });

  describe('getSession', () => {
    it('should return session when found', async () => {
      const mockSession = {
        _id: '507f1f77bcf86cd799439011',
        customerId: 'test-uuid',
        status: 'Pending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockChatSessionRepository.prototype.findById = jest.fn().mockResolvedValue(mockSession);

      const result = await chatSessionService.getSession('507f1f77bcf86cd799439011');

      expect(result).toBeDefined();
      expect(result?._id).toBe('507f1f77bcf86cd799439011');
    });

    it('should return null when session not found', async () => {
      mockChatSessionRepository.prototype.findById = jest.fn().mockResolvedValue(null);

      const result = await chatSessionService.getSession('invalid-id');

      expect(result).toBeNull();
    });

    it('should handle empty string session ID', async () => {
      mockChatSessionRepository.prototype.findById = jest.fn().mockResolvedValue(null);

      const result = await chatSessionService.getSession('');

      expect(result).toBeNull();
    });
  });

  describe('createMessage', () => {
    it('should create message with valid data', async () => {
      const sessionId = '507f1f77bcf86cd799439011';
      const mockSession = {
        _id: sessionId,
        customerId: 'test-uuid',
        status: 'Pending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockMessage = {
        _id: '507f1f77bcf86cd799439012',
        chatSessionId: sessionId,
        sender: 'customer' as const,
        content: 'Hello',
        timestamp: new Date(),
      };

      mockChatSessionRepository.prototype.findById = jest.fn().mockResolvedValue(mockSession);
      mockMessageRepository.prototype.create = jest.fn().mockResolvedValue(mockMessage);

      const result = await chatSessionService.createMessage(sessionId, {
        content: 'Hello',
        sender: 'customer',
      });

      expect(result).toBeDefined();
      expect(result.content).toBe('Hello');
      expect(result.sender).toBe('customer');
    });

    it('should throw error when session not found', async () => {
      mockChatSessionRepository.prototype.findById = jest.fn().mockResolvedValue(null);

      await expect(
        chatSessionService.createMessage('invalid-id', {
          content: 'Hello',
          sender: 'customer',
        })
      ).rejects.toThrow('Chat session not found');
    });

    it('should handle empty message content', async () => {
      const sessionId = '507f1f77bcf86cd799439011';
      const mockSession = {
        _id: sessionId,
        customerId: 'test-uuid',
        status: 'Pending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockChatSessionRepository.prototype.findById = jest.fn().mockResolvedValue(mockSession);
      mockMessageRepository.prototype.create = jest.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439012',
        chatSessionId: sessionId,
        sender: 'customer' as const,
        content: '',
        timestamp: new Date(),
      });

      const result = await chatSessionService.createMessage(sessionId, {
        content: '',
        sender: 'customer',
      });

      expect(result.content).toBe('');
    });

    it('should handle very long message content', async () => {
      const sessionId = '507f1f77bcf86cd799439011';
      const longMessage = 'a'.repeat(10000);
      const mockSession = {
        _id: sessionId,
        customerId: 'test-uuid',
        status: 'Pending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockChatSessionRepository.prototype.findById = jest.fn().mockResolvedValue(mockSession);
      mockMessageRepository.prototype.create = jest.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439012',
        chatSessionId: sessionId,
        sender: 'customer' as const,
        content: longMessage,
        timestamp: new Date(),
      });

      const result = await chatSessionService.createMessage(sessionId, {
        content: longMessage,
        sender: 'customer',
      });

      expect(result.content.length).toBe(10000);
    });
  });

  describe('updateStatus', () => {
    it('should update status to Confirmed', async () => {
      const sessionId = '507f1f77bcf86cd799439011';
      const mockSession = {
        _id: sessionId,
        customerId: 'test-uuid',
        status: 'Confirmed' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockChatSessionRepository.prototype.updateStatus = jest.fn().mockResolvedValue(mockSession);

      const result = await chatSessionService.updateStatus(sessionId, { status: 'Confirmed' });

      expect(result?.status).toBe('Confirmed');
    });

    it('should update status to Completed', async () => {
      const sessionId = '507f1f77bcf86cd799439011';
      const mockSession = {
        _id: sessionId,
        customerId: 'test-uuid',
        status: 'Completed' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockChatSessionRepository.prototype.updateStatus = jest.fn().mockResolvedValue(mockSession);

      const result = await chatSessionService.updateStatus(sessionId, { status: 'Completed' });

      expect(result?.status).toBe('Completed');
    });

    it('should return null when session not found', async () => {
      mockChatSessionRepository.prototype.updateStatus = jest.fn().mockResolvedValue(null);

      const result = await chatSessionService.updateStatus('invalid-id', { status: 'Confirmed' });

      expect(result).toBeNull();
    });
  });

  describe('getMessages', () => {
    it('should return empty array when no messages', async () => {
      mockMessageRepository.prototype.findBySessionId = jest.fn().mockResolvedValue([]);

      const result = await chatSessionService.getMessages('507f1f77bcf86cd799439011');

      expect(result).toEqual([]);
    });

    it('should return multiple messages', async () => {
      const sessionId = '507f1f77bcf86cd799439011';
      const mockMessages = [
        {
          _id: '1',
          chatSessionId: sessionId,
          sender: 'customer' as const,
          content: 'Hello',
          timestamp: new Date('2024-01-01'),
        },
        {
          _id: '2',
          chatSessionId: sessionId,
          sender: 'admin' as const,
          content: 'Hi there',
          timestamp: new Date('2024-01-02'),
        },
      ];

      mockMessageRepository.prototype.findBySessionId = jest.fn().mockResolvedValue(mockMessages);

      const result = await chatSessionService.getMessages(sessionId);

      expect(result.length).toBe(2);
      expect(result[0].content).toBe('Hello');
      expect(result[1].content).toBe('Hi there');
    });
  });
});

