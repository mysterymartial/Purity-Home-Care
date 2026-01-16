/// <reference types="jest" />
import { EmailService } from '../../services/Email.service';
import nodemailer from 'nodemailer';
import { notificationPreferencesService } from '../../services/NotificationPreferences.service';

// Mock nodemailer - use jest.mocked to access mocks
jest.mock('nodemailer');

// Mock NotificationPreferencesService
jest.mock('../../services/NotificationPreferences.service', () => ({
  notificationPreferencesService: {
    shouldSendEmail: jest.fn().mockReturnValue(true),
    getPreferences: jest.fn(),
    updatePreferences: jest.fn(),
  },
}));

describe('EmailService', () => {
  let emailService: EmailService;
  let mockSendMail: jest.Mock;
  let mockCreateTransport: jest.Mock;
  let mockShouldSendEmail: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock transporter with sendMail method
    mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });
    mockCreateTransport = jest.fn().mockReturnValue({
      sendMail: mockSendMail,
    });
    
    // Cast nodemailer.createTransport to the mock
    (nodemailer.createTransport as jest.Mock) = mockCreateTransport;
    
    // Setup mock for notification preferences
    mockShouldSendEmail = notificationPreferencesService.shouldSendEmail as jest.Mock;
    mockShouldSendEmail.mockReturnValue(true);
    
    // Reset environment variables
    delete process.env.ADMIN_EMAIL;
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_SECURE;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    
    // Set default env values for tests
    process.env.SMTP_HOST = 'smtp.gmail.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_SECURE = 'false';
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASS = 'test-password';
    process.env.ADMIN_EMAIL = 'admin@example.com';
    
    emailService = new EmailService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create transporter with correct SMTP configuration', () => {
      expect(mockCreateTransport).toHaveBeenCalledWith({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'test@example.com',
          pass: 'test-password',
        },
      });
    });

    it('should handle missing environment variables with defaults', () => {
      delete process.env.SMTP_HOST;
      delete process.env.SMTP_PORT;
      delete process.env.SMTP_SECURE;
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASS;
      delete process.env.ADMIN_EMAIL;

      const service = new EmailService();
      
      expect(mockCreateTransport).toHaveBeenCalled();
    });

    it('should parse SMTP_PORT as integer', () => {
      process.env.SMTP_PORT = '465';
      const service = new EmailService();
      
      expect(mockCreateTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          port: 465,
        })
      );
    });

    it('should handle SMTP_SECURE as boolean string', () => {
      process.env.SMTP_SECURE = 'true';
      const service = new EmailService();
      
      expect(mockCreateTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          secure: true,
        })
      );
    });
  });

  describe('sendNewChatNotification', () => {
    const sessionId = '507f1f77bcf86cd799439011';
    const customerId = 'test-uuid-123';

    it('should send email notification with correct data', async () => {
      await emailService.sendNewChatNotification(sessionId, customerId);

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: 'admin@example.com',
        subject: 'New Chat Session Created - Purity Home Care',
        html: expect.stringContaining(sessionId),
      });
    });

    it('should include session ID in email body', async () => {
      await emailService.sendNewChatNotification(sessionId, customerId);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(`<strong>Session ID:</strong> ${sessionId}`);
    });

    it('should include customer ID in email body', async () => {
      await emailService.sendNewChatNotification(sessionId, customerId);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(`<strong>Customer ID:</strong> ${customerId}`);
    });

    it('should include status in email body', async () => {
      await emailService.sendNewChatNotification(sessionId, customerId);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('<strong>Status:</strong> Pending');
    });

    it('should not send email if ADMIN_EMAIL is not configured', async () => {
      delete process.env.ADMIN_EMAIL;
      const service = new EmailService();
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await service.sendNewChatNotification(sessionId, customerId);

      expect(mockSendMail).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Admin email not configured. Skipping email notification.'
      );

      consoleSpy.mockRestore();
    });

    it('should not send email if notification preferences are disabled', async () => {
      mockShouldSendEmail.mockReturnValue(false);

      await emailService.sendNewChatNotification(sessionId, customerId);

      expect(mockSendMail).not.toHaveBeenCalled();
      expect(mockShouldSendEmail).toHaveBeenCalledWith('admin@example.com', 'newChat');
    });

    it('should send email if notification preferences are enabled', async () => {
      mockShouldSendEmail.mockReturnValue(true);

      await emailService.sendNewChatNotification(sessionId, customerId);

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockShouldSendEmail).toHaveBeenCalledWith('admin@example.com', 'newChat');
    });

    it('should not throw error if email sending fails', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP Error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(
        emailService.sendNewChatNotification(sessionId, customerId)
      ).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ Failed to send new chat notification email:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should log success message when email is sent', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      await emailService.sendNewChatNotification(sessionId, customerId);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '✅ New chat notification email sent successfully'
      );

      consoleLogSpy.mockRestore();
    });
  });

  describe('sendNewMessageNotification', () => {
    const sessionId = '507f1f77bcf86cd799439011';
    const customerId = 'test-uuid-123';
    const messageContent = 'Hello, I need help with booking.';

    it('should send email notification with correct data', async () => {
      await emailService.sendNewMessageNotification(sessionId, customerId, messageContent);

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: 'admin@example.com',
        subject: 'New Customer Message - Purity Home Care',
        html: expect.stringContaining(messageContent),
      });
    });

    it('should include session ID in email body', async () => {
      await emailService.sendNewMessageNotification(sessionId, customerId, messageContent);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(`<strong>Session ID:</strong> ${sessionId}`);
    });

    it('should include customer ID in email body', async () => {
      await emailService.sendNewMessageNotification(sessionId, customerId, messageContent);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(`<strong>Customer ID:</strong> ${customerId}`);
    });

    it('should include message content in email body', async () => {
      await emailService.sendNewMessageNotification(sessionId, customerId, messageContent);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(messageContent);
    });

    it('should handle empty message content', async () => {
      await emailService.sendNewMessageNotification(sessionId, customerId, '');

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('<strong>Message:</strong>');
    });

    it('should handle very long message content', async () => {
      const longMessage = 'a'.repeat(5000);
      await emailService.sendNewMessageNotification(sessionId, customerId, longMessage);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(longMessage);
    });

    it('should not send email if ADMIN_EMAIL is not configured', async () => {
      delete process.env.ADMIN_EMAIL;
      const service = new EmailService();
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await service.sendNewMessageNotification(sessionId, customerId, messageContent);

      expect(mockSendMail).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Admin email not configured. Skipping email notification.'
      );

      consoleSpy.mockRestore();
    });

    it('should not send email if notification preferences are disabled', async () => {
      mockShouldSendEmail.mockReturnValue(false);

      await emailService.sendNewMessageNotification(sessionId, customerId, messageContent);

      expect(mockSendMail).not.toHaveBeenCalled();
      expect(mockShouldSendEmail).toHaveBeenCalledWith('admin@example.com', 'newMessage');
    });

    it('should send email if notification preferences are enabled', async () => {
      mockShouldSendEmail.mockReturnValue(true);

      await emailService.sendNewMessageNotification(sessionId, customerId, messageContent);

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockShouldSendEmail).toHaveBeenCalledWith('admin@example.com', 'newMessage');
    });

    it('should not throw error if email sending fails', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP Error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(
        emailService.sendNewMessageNotification(sessionId, customerId, messageContent)
      ).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ Failed to send new message notification email:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should log success message when email is sent', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      await emailService.sendNewMessageNotification(sessionId, customerId, messageContent);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '✅ New message notification email sent successfully'
      );

      consoleLogSpy.mockRestore();
    });
  });

  describe('sendNewReviewNotification', () => {
    const reviewId = '507f1f77bcf86cd799439011';
    const rating = 5;
    const text = 'Excellent service, highly recommended!';

    it('should send email notification with correct data', async () => {
      await emailService.sendNewReviewNotification(reviewId, rating, text);

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: 'admin@example.com',
        subject: 'New Review Submitted - Purity Home Care',
        html: expect.stringContaining(reviewId),
      });
    });

    it('should include review ID in email body', async () => {
      await emailService.sendNewReviewNotification(reviewId, rating, text);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(`<strong>Review ID:</strong> ${reviewId}`);
    });

    it('should include rating in email body', async () => {
      await emailService.sendNewReviewNotification(reviewId, rating, text);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(`<strong>Rating:</strong> ${rating}/5`);
    });

    it('should include stars for rating', async () => {
      await emailService.sendNewReviewNotification(reviewId, rating, text);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('⭐⭐⭐⭐⭐');
    });

    it('should include review text when provided', async () => {
      await emailService.sendNewReviewNotification(reviewId, rating, text);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(text);
      expect(callArgs.html).toContain('<strong>Review Text:</strong>');
    });

    it('should handle review without text', async () => {
      await emailService.sendNewReviewNotification(reviewId, rating);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('<em>No review text provided.</em>');
      expect(callArgs.html).not.toContain('<strong>Review Text:</strong>');
    });

    it('should handle different ratings (1-5)', async () => {
      for (let r = 1; r <= 5; r++) {
        jest.clearAllMocks();
        await emailService.sendNewReviewNotification(reviewId, r);
        
        const callArgs = mockSendMail.mock.calls[0][0];
        expect(callArgs.html).toContain(`<strong>Rating:</strong> ${r}/5`);
      }
    });

    it('should include status in email body', async () => {
      await emailService.sendNewReviewNotification(reviewId, rating, text);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('<strong>Status:</strong> Pending Approval');
    });

    it('should not send email if ADMIN_EMAIL is not configured', async () => {
      delete process.env.ADMIN_EMAIL;
      const service = new EmailService();
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await service.sendNewReviewNotification(reviewId, rating, text);

      expect(mockSendMail).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Admin email not configured. Skipping email notification.'
      );

      consoleSpy.mockRestore();
    });

    it('should not send email if notification preferences are disabled', async () => {
      mockShouldSendEmail.mockReturnValue(false);

      await emailService.sendNewReviewNotification(reviewId, rating, text);

      expect(mockSendMail).not.toHaveBeenCalled();
      expect(mockShouldSendEmail).toHaveBeenCalledWith('admin@example.com', 'newReview');
    });

    it('should send email if notification preferences are enabled', async () => {
      mockShouldSendEmail.mockReturnValue(true);

      await emailService.sendNewReviewNotification(reviewId, rating, text);

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockShouldSendEmail).toHaveBeenCalledWith('admin@example.com', 'newReview');
    });

    it('should not throw error if email sending fails', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP Error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(
        emailService.sendNewReviewNotification(reviewId, rating, text)
      ).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ Failed to send new review notification email:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should log success message when email is sent', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      await emailService.sendNewReviewNotification(reviewId, rating, text);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '✅ New review notification email sent successfully'
      );

      consoleLogSpy.mockRestore();
    });

    it('should handle special characters in review text', async () => {
      const specialText = 'Great service! 👍 <script>alert("xss")</script>';
      await emailService.sendNewReviewNotification(reviewId, rating, specialText);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(specialText);
    });
  });
});
